import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  emailFromClerkUser,
  isConfiguredAdminEmail,
} from "@/lib/admin-auth";

export async function POST() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = emailFromClerkUser(clerkUser);
  if (!isConfiguredAdminEmail(email)) {
    return NextResponse.json(
      { error: "This email is not allowed to create an admin account." },
      { status: 403 }
    );
  }

  const [existing] = await db
    .select({
      role: users.role,
      onboardedAt: users.onboardedAt,
    })
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (existing?.onboardedAt && existing.role !== "admin") {
    return NextResponse.json(
      {
        error:
          "This account is already configured as a marketplace user. Use a separate allowlisted admin email.",
      },
      { status: 409 }
    );
  }

  const identity = {
    role: "admin" as const,
    email: email ?? `${clerkUser.id}@no-email.braidel.invalid`,
    firstName: clerkUser.firstName ?? "",
    lastName: clerkUser.lastName ?? "",
    avatarUrl: clerkUser.imageUrl || null,
    onboardedAt: existing?.onboardedAt ?? new Date(),
    deletedAt: null,
    updatedAt: new Date(),
  };

  await db
    .insert(users)
    .values({
      clerkId: clerkUser.id,
      ...identity,
    })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: identity,
    });

  return NextResponse.json({ ok: true });
}
