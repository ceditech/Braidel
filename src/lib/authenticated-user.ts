import "server-only";

import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { cookies } from "next/headers";
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

/**
 * Admin "preview as" mode — lets a marketplace admin browse the dashboard
 * shell as a Salon/Braider/Client for UI review and testing, WITHOUT
 * granting access to any other user's data. Queries scoped by clerkId still
 * resolve to the admin's own (empty) records, so no real user's private
 * data is ever exposed through preview. The cookie is httpOnly and can only
 * be set by an authenticated marketplace admin via
 * POST /api/admin/preview (see getMarketplaceAdminForApi there).
 */
export type AdminPreviewRole = "salon" | "braider" | "client";
export const ADMIN_PREVIEW_COOKIE = "admin_preview_role";

export function previewRoleToDbRole(preview: AdminPreviewRole): DbUserRole {
  return preview === "salon" ? "salon_owner" : preview;
}

export async function getAdminPreviewRole(): Promise<AdminPreviewRole | null> {
  const store = await cookies();
  const value = store.get(ADMIN_PREVIEW_COOKIE)?.value;
  return value === "salon" || value === "braider" || value === "client"
    ? value
    : null;
}

/** The role that should drive dashboard UI/nav — the admin's real role,
 * unless they are actively previewing another role. */
export async function getEffectiveDashboardRole(
  user: AuthenticatedDbUser
): Promise<DashboardRole> {
  if (user.role === "admin") {
    const preview = await getAdminPreviewRole();
    if (preview) return preview;
  }
  return toDashboardRole(user.role);
}

export interface AuthenticatedDbUser {
  id: string;
  clerkId: string;
  role: DbUserRole;
  accountStatus: "active" | "suspended";
  firstName: string;
  lastName: string;
  email: string;
  onboardedAt: Date | null;
}

export async function getDbUserByClerkId(
  clerkId: string,
  options: { includeSuspended?: boolean } = {}
): Promise<AuthenticatedDbUser | null> {
  const conditions = [eq(users.clerkId, clerkId), isNull(users.deletedAt)];
  if (!options.includeSuspended) {
    conditions.push(eq(users.accountStatus, "active"));
  }

  const [user] = await db
    .select({
      id: users.id,
      clerkId: users.clerkId,
      role: users.role,
      accountStatus: users.accountStatus,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      onboardedAt: users.onboardedAt,
    })
    .from(users)
    .where(and(...conditions))
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

  const user = await getDbUserByClerkId(userId, { includeSuspended: true });
  if (user?.accountStatus === "suspended") redirect("/account-suspended");
  if (!user?.onboardedAt) redirect("/onboarding");

  return user;
}

export async function requireDashboardRole(
  ...allowedRoles: DbUserRole[]
): Promise<AuthenticatedDbUser> {
  const user = await requireOnboardedUser();
  if (user.role === "admin") {
    const preview = await getAdminPreviewRole();
    if (preview && allowedRoles.includes(previewRoleToDbRole(preview))) {
      return user;
    }
    redirect("/dashboard");
  }
  if (!allowedRoles.includes(user.role)) redirect("/dashboard");
  return user;
}

export { toDashboardRole };
