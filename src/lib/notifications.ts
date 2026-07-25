import { db } from "@/db";
import { notifications } from "@/db/schema";
import type { NotificationType } from "@/db/queries";

interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  href?: string | null;
  eventKey?: string | null;
}

export async function createNotification(input: CreateNotificationInput) {
  await db
    .insert(notifications)
    .values({
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body,
      href: input.href ?? null,
      eventKey: input.eventKey ?? null,
    })
    .onConflictDoNothing({ target: notifications.eventKey });
}
