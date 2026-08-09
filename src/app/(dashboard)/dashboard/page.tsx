import {
  getActiveOpportunities,
  getApplicantsForSalon,
  getApplicationsForBraider,
  getOpportunitiesForSalon,
  type ApplicantDTO,
  type ApplicationDTO,
  type OpportunityDTO,
} from "@/db/queries";
import { requireOnboardedUser } from "@/lib/authenticated-user";
import { DashboardClient } from "./DashboardClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireOnboardedUser();
  if (user.role === "admin") redirect("/dashboard/admin");

  let salonOpportunities: OpportunityDTO[] = [];
  let salonApplicants: ApplicantDTO[] = [];
  let braiderOpportunities: OpportunityDTO[] = [];
  let braiderApplications: ApplicationDTO[] = [];

  if (user.role === "salon_owner") {
    [salonOpportunities, salonApplicants] = await Promise.all([
      getOpportunitiesForSalon(user.clerkId),
      getApplicantsForSalon(user.clerkId),
    ]);
  }

  if (user.role === "braider") {
    [braiderOpportunities, braiderApplications] = await Promise.all([
      getActiveOpportunities(),
      getApplicationsForBraider(user.clerkId),
    ]);
  }

  return (
    <DashboardClient
      firstName={user.firstName || "there"}
      salonOpportunities={salonOpportunities}
      salonApplicants={salonApplicants}
      braiderOpportunities={braiderOpportunities}
      braiderApplications={braiderApplications}
    />
  );
}
