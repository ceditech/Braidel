import { getActiveOpportunities } from "@/db/queries";
import { requireDashboardRole } from "@/lib/authenticated-user";
import { FindWorkClient } from "./FindWorkClient";

export const dynamic = "force-dynamic";

export default async function FindWorkPage() {
  await requireDashboardRole("braider");
  const jobs = await getActiveOpportunities();
  return <FindWorkClient jobs={jobs} />;
}
