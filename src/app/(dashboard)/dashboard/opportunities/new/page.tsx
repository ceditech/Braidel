import { currentUser } from "@clerk/nextjs/server";
import { getBraidStyles, getOpportunitiesForSalon } from "@/db/queries";
import { NewOpportunityClient } from "./NewOpportunityClient";

export const dynamic = "force-dynamic";

export default async function NewOpportunityPage() {
  const user = await currentUser();
  const [opportunities, styles] = await Promise.all([
    user ? getOpportunitiesForSalon(user.id) : [],
    getBraidStyles(),
  ]);

  return <NewOpportunityClient opportunities={opportunities} styles={styles} />;
}
