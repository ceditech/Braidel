import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDbUserByClerkId } from "@/lib/authenticated-user";
import {
  emailFromClerkUser,
  isConfiguredAdminEmail,
} from "@/lib/admin-auth";
import { AdminSetupClient } from "./AdminSetupClient";

export const dynamic = "force-dynamic";

export default async function AdminSetupPage() {
  const user = await currentUser();
  if (!user) redirect("/admin/sign-in");

  const email = emailFromClerkUser(user);
  if (!isConfiguredAdminEmail(email)) redirect("/onboarding");

  const dbUser = await getDbUserByClerkId(user.id);
  if (dbUser?.onboardedAt && dbUser.role === "admin") {
    redirect("/dashboard/admin");
  }

  return <AdminSetupClient />;
}
