import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  braiders,
  clientProfiles,
  salons,
  serviceProviders,
  users,
} from "@/db/schema";

type UserRole = typeof users.$inferInsert.role;

export async function POST(req: NextRequest) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role } = (await req.json()) as { role?: UserRole };
  if (role !== "salon_owner" && role !== "braider" && role !== "client") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const [existing] = await db
    .select({
      role: users.role,
      onboardedAt: users.onboardedAt,
    })
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (existing?.onboardedAt && existing.role !== role) {
    return NextResponse.json(
      { error: "This account already has a role. Contact support to change it." },
      { status: 409 }
    );
  }

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    `${clerkUser.id}@no-email.braidel.invalid`;
  const identity = {
    role,
    email,
    firstName: clerkUser.firstName ?? "",
    lastName: clerkUser.lastName ?? "",
    avatarUrl: clerkUser.imageUrl,
    onboardedAt: existing?.onboardedAt ?? new Date(),
    deletedAt: null,
    updatedAt: new Date(),
  };

  const [user] = await db
    .insert(users)
    .values({
      clerkId: clerkUser.id,
      ...identity,
    })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: identity,
    })
    .returning();

  if (role === "salon_owner") {
    await db
      .insert(salons)
      .values({
        ownerId: user.id,
        name: clerkUser.firstName ? `${clerkUser.firstName}'s Salon` : "My Salon",
        slug: `${clerkUser.id}-salon`,
      })
      .onConflictDoNothing({ target: salons.ownerId });

    const [salon] = await db
      .select({ id: salons.id })
      .from(salons)
      .where(eq(salons.ownerId, user.id))
      .limit(1);

    if (salon) {
      await db
        .insert(serviceProviders)
        .values({ providerType: "salon", salonId: salon.id })
        .onConflictDoNothing({ target: serviceProviders.salonId });
    }
  }

  if (role === "braider") {
    await db
      .insert(braiders)
      .values({ userId: user.id, slug: `${clerkUser.id}-braider` })
      .onConflictDoNothing({ target: braiders.userId });

    const [braider] = await db
      .select({ id: braiders.id })
      .from(braiders)
      .where(eq(braiders.userId, user.id))
      .limit(1);

    if (braider) {
      await db
        .insert(serviceProviders)
        .values({ providerType: "braider", braiderId: braider.id })
        .onConflictDoNothing({ target: serviceProviders.braiderId });
    }
  }

  if (role === "client") {
    await db
      .insert(clientProfiles)
      .values({ userId: user.id })
      .onConflictDoNothing({ target: clientProfiles.userId });
  }

  return NextResponse.json({ ok: true });
}
