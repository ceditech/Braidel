import { getActiveOpportunities } from "@/db/queries";
import { FindWorkClient } from "./FindWorkClient";

export const dynamic = "force-dynamic";

export default async function FindWorkPage() {
  const jobs = await getActiveOpportunities();
  return <FindWorkClient jobs={jobs} />;
}
