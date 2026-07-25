import { currentUser } from "@clerk/nextjs/server";
import { getNotificationsForUser } from "@/db/queries";
import { NotificationsClient } from "./NotificationsClient";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await currentUser();
  const notifications = user ? await getNotificationsForUser(user.id) : [];
  return <NotificationsClient initialNotifications={notifications} />;
}
