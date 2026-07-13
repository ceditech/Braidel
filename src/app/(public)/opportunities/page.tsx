import { getActiveOpportunities } from "@/db/queries";
import { OpportunitiesClient } from "./OpportunitiesClient";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  const jobs = await getActiveOpportunities();
  return <OpportunitiesClient jobs={jobs} />;
}
