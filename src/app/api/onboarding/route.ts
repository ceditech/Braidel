import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, salons, braiders } from "@/db/schema";

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
  }

  if (role === "braider") {
    await db
      .insert(braiders)
      .values({ userId: user.id, slug: `${clerkUser.id}-braider` })
      .onConflictDoNothing({ target: braiders.userId });
  }

  return NextResponse.json({ ok: true });
}
