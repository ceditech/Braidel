import "server-only";

import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  toDashboardRole,
  type DashboardRole,
  type UserRole,
} from "@/lib/roles";

export type DbUserRole = UserRole;
export type { DashboardRole };

export interface AuthenticatedDbUser {
  id: string;
  clerkId: string;
  role: DbUserRole;
  firstName: string;
  lastName: string;
  email: string;
  onboardedAt: Date | null;
}

export async function getDbUserByClerkId(
  clerkId: string
): Promise<AuthenticatedDbUser | null> {
  const [user] = await db
    .select({
      id: users.id,
      clerkId: users.clerkId,
      role: users.role,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      onboardedAt: users.onboardedAt,
    })
    .from(users)
    .where(and(eq(users.clerkId, clerkId), isNull(users.deletedAt)))
    .limit(1);

  return user ?? null;
}

export async function getAuthenticatedDbUser(): Promise<AuthenticatedDbUser | null> {
  const { userId } = await auth();
  return userId ? getDbUserByClerkId(userId) : null;
}

export async function requireOnboardedUser(): Promise<AuthenticatedDbUser> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getDbUserByClerkId(userId);
  if (!user?.onboardedAt) redirect("/onboarding");

  return user;
}

export async function requireDashboardRole(
  ...allowedRoles: DbUserRole[]
): Promise<AuthenticatedDbUser> {
  const user = await requireOnboardedUser();
  if (!allowedRoles.includes(user.role)) redirect("/dashboard");
  return user;
}

export { toDashboardRole };
