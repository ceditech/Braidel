import { getBraidStyles, getOpportunitiesForSalon } from "@/db/queries";
import { requireDashboardRole } from "@/lib/authenticated-user";
import { NewOpportunityClient } from "./NewOpportunityClient";

export const dynamic = "force-dynamic";

export default async function NewOpportunityPage() {
  const user = await requireDashboardRole("salon_owner");
  const [opportunities, styles] = await Promise.all([
    getOpportunitiesForSalon(user.clerkId),
    getBraidStyles(),
  ]);

  return <NewOpportunityClient opportunities={opportunities} styles={styles} />;
}
