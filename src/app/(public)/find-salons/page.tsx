import { getBraidStyles, getSalons } from "@/db/queries";
import { FindSalonsClient } from "./FindSalonsClient";

export const dynamic = "force-dynamic";

export default async function FindSalonsPage() {
  const [salons, styles] = await Promise.all([getSalons(), getBraidStyles()]);
  return <FindSalonsClient salons={salons} specialtyOptions={styles.map((style) => style.name)} />;
}
