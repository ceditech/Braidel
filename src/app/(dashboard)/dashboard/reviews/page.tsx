import { getProviderForUser } from "@/db/booking-queries";
import { getProviderReviewDashboard } from "@/db/review-queries";
import { requireDashboardRole } from "@/lib/authenticated-user";
import { ProviderReviewsClient } from "./ProviderReviewsClient";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const user = await requireDashboardRole("salon_owner", "braider");
  const provider = await getProviderForUser(user);
  const dashboard = await getProviderReviewDashboard(provider, user.id);

  return <ProviderReviewsClient dashboard={dashboard} />;
}
