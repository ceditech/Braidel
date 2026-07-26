import { getApplicantsForSalon } from "@/db/queries";
import { requireDashboardRole } from "@/lib/authenticated-user";
import { ApplicantsClient } from "./ApplicantsClient";

export const dynamic = "force-dynamic";

export default async function ApplicantsPage() {
  const user = await requireDashboardRole("salon_owner");
  const applicants = await getApplicantsForSalon(user.clerkId);
  return <ApplicantsClient applicants={applicants} />;
}
