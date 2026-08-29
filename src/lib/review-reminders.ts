import "server-only";

import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import {
  bookings,
  clientProfiles,
  notificationPreferences,
  ratings,
  reviewReminderEvents,
} from "@/db/schema";
import { createNotification } from "@/lib/notifications";

/** Workstream 6.6: capped review reminders. Timing is expressed as an offset
 *  from booking completion, matching docs/WORKSTREAM_6_TRUST_VERIFICATION_PLAN.md. */
const REMINDER_SCHEDULE = [
  { number: 1, afterMs: 24 * 60 * 60 * 1000 },
  { number: 2, afterMs: 3 * 24 * 60 * 60 * 1000 },
  { number: 3, afterMs: 7 * 24 * 60 * 60 * 1000 },
  { number: 4, afterMs: 14 * 24 * 60 * 60 * 1000 },
  { number: 5, afterMs: 30 * 24 * 60 * 60 * 1000 },
] as const;

/** This app has two opportunistic call sites for the same user (the
 *  notifications page's own server render, and the notification bell's
 *  client-side fetch), which can fire seconds apart on one visit. Without a
 *  floor, a booking with a multi-tier backlog could have two tiers advanced
 *  in that single visit instead of one. A 1-hour minimum gap between
 *  reminders *for the same booking* closes that without suppressing a
 *  legitimately separate reminder for a different unreviewed booking. Once a
 *  real cron replaces these call sites (invocations naturally ~24h apart),
 *  this floor becomes a no-op rather than needing to be removed. */
const MIN_GAP_BETWEEN_REMINDERS_MS = 60 * 60 * 1000;

/**
 * Opportunistically sends the next due review reminder for a client's
 * completed, unreviewed bookings — capped at 5 per booking, spaced per
 * REMINDER_SCHEDULE, stopping immediately once a review exists.
 *
 * There is no background scheduler in this app, so this runs on notification
 * fetch instead of a cron job (in-app only, per the plan's "can remain
 * internal/in-app first" note).
 *
 * Idempotent two ways: the (bookingId, reminderNumber) unique constraint on
 * review_reminder_events, and createNotification's own eventKey uniqueness.
 */
export async function backfillDueReviewReminders(userId: string): Promise<void> {
  const [prefs] = await db
    .select({ activity: notificationPreferences.activity })
    .from(notificationPreferences)
    .where(eq(notificationPreferences.userId, userId))
    .limit(1);
  if (prefs && !prefs.activity) return;

  const [clientProfile] = await db
    .select({ id: clientProfiles.id })
    .from(clientProfiles)
    .where(eq(clientProfiles.userId, userId))
    .limit(1);
  if (!clientProfile) return;

  const dueBookings = await db
    .select({
      id: bookings.id,
      serviceName: bookings.serviceName,
      endsAt: bookings.endsAt,
    })
    .from(bookings)
    .leftJoin(ratings, eq(ratings.bookingId, bookings.id))
    .where(
      and(
        eq(bookings.clientProfileId, clientProfile.id),
        eq(bookings.status, "completed"),
        isNull(ratings.id)
      )
    );
  if (!dueBookings.length) return;

  const now = Date.now();

  for (const booking of dueBookings) {
    const sentRows = await db
      .select({ reminderNumber: reviewReminderEvents.reminderNumber, sentAt: reviewReminderEvents.sentAt })
      .from(reviewReminderEvents)
      .where(eq(reviewReminderEvents.bookingId, booking.id))
      .orderBy(desc(reviewReminderEvents.sentAt));

    const lastSentAt = sentRows[0]?.sentAt;
    if (lastSentAt && now - lastSentAt.getTime() < MIN_GAP_BETWEEN_REMINDERS_MS) continue;

    const sentNumbers = new Set(sentRows.map((row) => row.reminderNumber));
    const nextTier = REMINDER_SCHEDULE.find((tier) => !sentNumbers.has(tier.number));
    if (!nextTier) continue; // all 5 reminders already sent for this booking

    const dueAt = booking.endsAt.getTime() + nextTier.afterMs;
    if (now < dueAt) continue; // not due yet

    await db
      .insert(reviewReminderEvents)
      .values({ bookingId: booking.id, reminderNumber: nextTier.number })
      .onConflictDoNothing({
        target: [reviewReminderEvents.bookingId, reviewReminderEvents.reminderNumber],
      });

    await createNotification({
      userId,
      type: "review",
      title: "How was your appointment?",
      body: `Share a quick review of your ${booking.serviceName} — it helps other clients and only takes a minute.`,
      href: `/dashboard/appointments?booking=${booking.id}`,
      eventKey: `review-reminder:${booking.id}:${nextTier.number}`,
    });
  }
}
