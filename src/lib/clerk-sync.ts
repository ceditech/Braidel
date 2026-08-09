import type { UserJSON } from "@clerk/backend";
import { and, eq, inArray, isNull, lte, or } from "drizzle-orm";
import { db } from "@/db";
import { braiders, opportunities, salons, users } from "@/db/schema";

type UserRole = typeof users.$inferInsert.role;

export type ClerkSyncResult = {
  status: "created" | "updated" | "deleted" | "missing" | "stale";
  userId?: string;
};

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

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, user.id))
    .limit(1);

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
