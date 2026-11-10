import type { UserJSON } from "@clerk/backend";
import { and, eq, inArray, isNull, lte, or } from "drizzle-orm";
import { db } from "@/db";
import { braiders, opportunities, salons, users } from "@/db/schema";
import { decideClerkLink, type ClerkLinkDecision } from "@/lib/clerk-link-domain";

type UserRole = typeof users.$inferInsert.role;

export type ClerkSyncResult = {
  status: "created" | "updated" | "deleted" | "missing" | "stale" | "conflict";
  userId?: string;
};

/**
 * Re-attaches a Clerk identity to the existing Neon row that uses the same
 * verified email (see clerk-link-domain.ts). Used after moving to a new Clerk
 * instance, where every person gets a new Clerk ID. Idempotent and safe to call
 * from several paths at once: the UPDATE only fires while the row still holds
 * the old Clerk ID.
 */
export async function relinkClerkIdentityByEmail(identity: {
  clerkId: string;
  email: string;
  emailVerified: boolean;
}): Promise<{ decision: ClerkLinkDecision; userId?: string }> {
  const [existingByEmail] = await db
    .select({ id: users.id, clerkId: users.clerkId, deletedAt: users.deletedAt })
    .from(users)
    .where(eq(users.email, identity.email))
    .limit(1);

  const decision = decideClerkLink({
    incomingClerkId: identity.clerkId,
    emailVerified: identity.emailVerified,
    existingByEmail: existingByEmail
      ? { clerkId: existingByEmail.clerkId, deletedAt: existingByEmail.deletedAt }
      : null,
  });

  if (decision !== "link" || !existingByEmail) {
    return { decision, userId: existingByEmail?.id };
  }

  const [linked] = await db
    .update(users)
    .set({ clerkId: identity.clerkId, updatedAt: new Date() })
    .where(
      and(
        eq(users.id, existingByEmail.id),
        eq(users.clerkId, existingByEmail.clerkId),
        isNull(users.deletedAt)
      )
    )
    .returning({ id: users.id });

  if (linked) {
    console.info("Clerk identity re-linked by verified email", {
      userId: linked.id,
      previousClerkIdSuffix: existingByEmail.clerkId.slice(-6),
      newClerkIdSuffix: identity.clerkId.slice(-6),
    });
  }
  return { decision, userId: linked?.id ?? existingByEmail.id };
}

const USER_ROLES = new Set<UserRole>(["salon_owner", "braider", "client", "admin"]);

function roleFromMetadata(metadata: UserJSON["public_metadata"]): UserRole {
  const candidate = (metadata as Record<string, unknown>).role;
  return typeof candidate === "string" && USER_ROLES.has(candidate as UserRole)
    ? (candidate as UserRole)
    : "client";
}

function primaryEmail(user: UserJSON): string {
  const primary = user.email_addresses.find(
    (email) => email.id === user.primary_email_address_id
  );

  return (
    primary?.email_address ??
    user.email_addresses[0]?.email_address ??
    `${user.id}@no-email.braidel.invalid`
  );
}

function clerkTimestamp(value: number): Date {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export async function syncClerkUser(user: UserJSON): Promise<ClerkSyncResult> {
  const clerkUpdatedAt = clerkTimestamp(user.updated_at);
  const identity = {
    email: primaryEmail(user),
    firstName: user.first_name ?? "",
    lastName: user.last_name ?? "",
    avatarUrl: user.image_url || null,
    clerkUpdatedAt,
    deletedAt: null,
    updatedAt: new Date(),
  };

  let [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, user.id))
    .limit(1);

  if (!existing) {
    const primary = user.email_addresses.find(
      (email) => email.id === user.primary_email_address_id
    );
    const relinked = await relinkClerkIdentityByEmail({
      clerkId: user.id,
      email: identity.email,
      emailVerified: primary?.verification?.status === "verified",
    });
    if (relinked.decision === "conflict") {
      console.warn("Clerk sync skipped: email already used by another account", {
        clerkIdSuffix: user.id.slice(-6),
      });
      return { status: "conflict", userId: relinked.userId };
    }
    if (relinked.decision === "link" && relinked.userId) {
      existing = { id: relinked.userId };
    }
  }

  const [synced] = await db
    .insert(users)
    .values({
      clerkId: user.id,
      role: roleFromMetadata(user.public_metadata),
      ...identity,
    })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: identity,
      setWhere: or(isNull(users.clerkUpdatedAt), lte(users.clerkUpdatedAt, clerkUpdatedAt)),
    })
    .returning({ id: users.id });

  if (!synced) return { status: "stale", userId: existing?.id };
  return { status: existing ? "updated" : "created", userId: synced.id };
}

export async function tombstoneClerkUser(
  clerkId: string,
  occurredAt: Date
): Promise<ClerkSyncResult> {
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!existing) return { status: "missing" };

  const [deleted] = await db
    .update(users)
    .set({
      email: `${clerkId}@deleted.braidel.invalid`,
      firstName: "Deleted",
      lastName: "User",
      avatarUrl: null,
      clerkUpdatedAt: occurredAt,
      deletedAt: occurredAt,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(users.clerkId, clerkId),
        or(isNull(users.clerkUpdatedAt), lte(users.clerkUpdatedAt, occurredAt))
      )
    )
    .returning({ id: users.id });

  if (!deleted) return { status: "stale", userId: existing.id };

  await db
    .update(braiders)
    .set({ isAvailable: false, updatedAt: new Date() })
    .where(eq(braiders.userId, deleted.id));

  const ownedSalonIds = db
    .select({ id: salons.id })
    .from(salons)
    .where(eq(salons.ownerId, deleted.id));

  await db
    .update(opportunities)
    .set({ isActive: false, updatedAt: new Date() })
    .where(inArray(opportunities.salonId, ownedSalonIds));

  return { status: "deleted", userId: deleted.id };
}
