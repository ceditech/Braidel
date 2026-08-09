import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getDbUserByClerkId } from "@/lib/authenticated-user";
import {
  emailFromClerkUser,
  isConfiguredAdminEmail,
} from "@/lib/admin-auth";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await getDbUserByClerkId(user.id);
  if (dbUser?.onboardedAt) redirect("/dashboard");
  if (isConfiguredAdminEmail(emailFromClerkUser(user))) redirect("/admin/setup");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1">Welcome to Braidel</h1>
        <p className="text-gray-500 mb-6">How will you be using Braidel?</p>
        <OnboardingForm />
      </div>
    </div>
  );
}
