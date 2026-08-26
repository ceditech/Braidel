import "server-only";

import type { User } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getAuthenticatedDbUser,
  requireOnboardedUser,
  type AuthenticatedDbUser,
} from "@/lib/authenticated-user";

function configuredAdminEmails() {
  return new Set(
    (process.env.BRAIDEL_ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isConfiguredAdminEmail(email: string | null | undefined) {
  return email ? configuredAdminEmails().has(email.toLowerCase()) : false;
}

export function emailFromClerkUser(user: User) {
  return (
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    null
  );
}

export function isMarketplaceAdmin(user: Pick<AuthenticatedDbUser, "email">) {
  return isConfiguredAdminEmail(user.email);
}

export async function requireMarketplaceAdmin(): Promise<AuthenticatedDbUser> {
  const user = await requireOnboardedUser();
  if (!isMarketplaceAdmin(user)) redirect("/dashboard");
  return user;
}

export async function getMarketplaceAdminForApi() {
  const user = await getAuthenticatedDbUser();
  if (!user?.onboardedAt || !isMarketplaceAdmin(user)) return null;
  return user;
}
