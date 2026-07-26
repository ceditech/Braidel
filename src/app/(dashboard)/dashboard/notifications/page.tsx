import { getNotificationsForUser } from "@/db/queries";
import { requireOnboardedUser } from "@/lib/authenticated-user";
import { NotificationsClient } from "./NotificationsClient";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await requireOnboardedUser();
  const notifications = await getNotificationsForUser(user.clerkId);
  return <NotificationsClient initialNotifications={notifications} />;
}
