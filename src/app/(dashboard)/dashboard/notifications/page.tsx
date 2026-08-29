import { getNotificationsForUser } from "@/db/queries";
import { requireOnboardedUser } from "@/lib/authenticated-user";
import { backfillDueReviewReminders } from "@/lib/review-reminders";
import { NotificationsClient } from "./NotificationsClient";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await requireOnboardedUser();

  if (user.role === "client") {
    // Same opportunistic backfill as GET /api/notifications, run here too so
    // a due reminder appears on this page's first render instead of lagging
    // one navigation behind the notification bell's own fetch. Idempotent
    // and isolated — a failure here must never block the notifications page.
    try {
      await backfillDueReviewReminders(user.id);
    } catch (error) {
      console.error("backfillDueReviewReminders failed", error);
    }
  }

  const notifications = await getNotificationsForUser(user.clerkId);
  return <NotificationsClient initialNotifications={notifications} />;
}
