import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, salons, braiders } from "@/db/schema";

export async function POST(req: NextRequest) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role } = await req.json();
  if (!["salon_owner", "braider", "client"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const [user] = await db
    .insert(users)
    .values({
      clerkId: clerkUser.id,
      role,
      email: clerkUser.emailAddresses[0].emailAddress,
      firstName: clerkUser.firstName ?? "",
      lastName: clerkUser.lastName ?? "",
      avatarUrl: clerkUser.imageUrl,
    })
    .onConflictDoNothing()
    .returning();

  // Seed the role-specific profile row
  if (role === "salon_owner" && user) {
    await db
      .insert(salons)
      .values({
        ownerId: user.id,
        name: `${clerkUser.firstName}'s Salon`,
        slug: `${clerkUser.id}-salon`,
      })
      .onConflictDoNothing();
  }

  if (role === "braider" && user) {
    await db
      .insert(braiders)
      .values({ userId: user.id, slug: `${clerkUser.id}-braider` })
      .onConflictDoNothing();
  }

  return NextResponse.json({ ok: true });
}
