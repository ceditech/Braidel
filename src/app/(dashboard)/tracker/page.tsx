import { requireMarketplaceAdmin } from "@/lib/admin-auth";
import { TrackerClient } from "./TrackerClient";

export default async function TrackerPage() {
  await requireMarketplaceAdmin();
  return <TrackerClient />;
}
