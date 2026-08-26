import { Topbar } from "@/components/dashboard/Topbar";
import { getMarketplaceAdminDashboard } from "@/db/admin-queries";
import { requireMarketplaceAdmin } from "@/lib/admin-auth";
import { AdminModerationClient } from "./AdminModerationClient";

export const dynamic = "force-dynamic";

export default async function AdminModerationPage() {
  await requireMarketplaceAdmin();
  const dashboard = await getMarketplaceAdminDashboard();

  return (
    <>
      <Topbar
        title="Admin portal"
        subtitle="Monitor marketplace performance, manage user lifecycle, and review trust queues."
      />
      <AdminModerationClient initialDashboard={dashboard} />
    </>
  );
}
