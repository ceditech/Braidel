"use client";
import { useRole } from "@/components/dashboard/RoleContext";
import { SalonDashboardHome } from "@/components/dashboard/SalonDashboardHome";
import { BraiderDashboardHome } from "@/components/dashboard/BraiderDashboardHome";
import type { ApplicantDTO, ApplicationDTO, OpportunityDTO } from "@/db/queries";

export function DashboardClient({
  firstName,
  salonOpportunities,
  salonApplicants,
  braiderOpportunities,
  braiderApplications,
}: {
  firstName: string;
  salonOpportunities: OpportunityDTO[];
  salonApplicants: ApplicantDTO[];
  braiderOpportunities: OpportunityDTO[];
  braiderApplications: ApplicationDTO[];
}) {
  const { role } = useRole();

  return role === "braider" ? (
    <BraiderDashboardHome
      firstName={firstName}
      opportunities={braiderOpportunities}
      applications={braiderApplications}
    />
  ) : (
    <SalonDashboardHome
      firstName={firstName}
      opportunities={salonOpportunities}
      applicants={salonApplicants}
    />
  );
}
