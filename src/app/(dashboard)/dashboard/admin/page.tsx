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
        title="Admin moderation"
        subtitle="Review verification submissions and reported reviews with audit-backed decisions."
      />
      <AdminModerationClient initialDashboard={dashboard} />
    </>
  );
}
