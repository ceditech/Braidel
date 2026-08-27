import {
  getActiveOpportunities,
  getApplicantsForSalon,
  getApplicationsForBraider,
  getOpportunitiesForSalon,
  type ApplicantDTO,
  type ApplicationDTO,
  type OpportunityDTO,
} from "@/db/queries";
import {
  requireOnboardedUser,
  getAdminPreviewRole,
  previewRoleToDbRole,
} from "@/lib/authenticated-user";
import { DashboardClient } from "./DashboardClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireOnboardedUser();

  const previewRole = user.role === "admin" ? await getAdminPreviewRole() : null;
  if (user.role === "admin" && !previewRole) redirect("/dashboard/admin");
  const effectiveRole = previewRole ? previewRoleToDbRole(previewRole) : user.role;

  let salonOpportunities: OpportunityDTO[] = [];
  let salonApplicants: ApplicantDTO[] = [];
  let braiderOpportunities: OpportunityDTO[] = [];
  let braiderApplications: ApplicationDTO[] = [];

  if (effectiveRole === "salon_owner") {
    [salonOpportunities, salonApplicants] = await Promise.all([
      getOpportunitiesForSalon(user.clerkId),
      getApplicantsForSalon(user.clerkId),
    ]);
  }

  if (effectiveRole === "braider") {
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
