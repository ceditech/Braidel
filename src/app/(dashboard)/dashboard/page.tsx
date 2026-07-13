import { currentUser } from "@clerk/nextjs/server";
import {
  getActiveOpportunities,
  getApplicantsForSalon,
  getApplicationsForBraider,
  getOpportunitiesForSalon,
} from "@/db/queries";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? "there";
  const clerkId = user?.id ?? "";

  const [salonOpportunities, salonApplicants, braiderOpportunities, braiderApplications] = await Promise.all([
    clerkId ? getOpportunitiesForSalon(clerkId) : [],
    clerkId ? getApplicantsForSalon(clerkId) : [],
    getActiveOpportunities(),
    clerkId ? getApplicationsForBraider(clerkId) : [],
  ]);

  return (
    <DashboardClient
      firstName={firstName}
      salonOpportunities={salonOpportunities}
      salonApplicants={salonApplicants}
      braiderOpportunities={braiderOpportunities}
      braiderApplications={braiderApplications}
    />
  );
}
