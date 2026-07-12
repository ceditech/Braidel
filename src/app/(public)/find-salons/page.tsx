import { getSalons } from "@/db/queries";
import { FindSalonsClient } from "./FindSalonsClient";

export const dynamic = "force-dynamic";

export default async function FindSalonsPage() {
  const salons = await getSalons();
  return <FindSalonsClient salons={salons} />;
}
