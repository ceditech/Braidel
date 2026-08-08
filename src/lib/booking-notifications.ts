import "server-only";

import type { AuthenticatedDbUser } from "@/lib/authenticated-user";
import {
  getBookingParticipantContext,
  resolveBookingRecipient,
} from "@/lib/booking-participants";
import type { BookingAction, BookingStatus } from "@/lib/booking-domain";
import { createNotification } from "@/lib/notifications";

export async function notifyBookingRequested(
  bookingId: string,
  actor: AuthenticatedDbUser
) {
  const booking = await getBookingParticipantContext(bookingId);
  if (!booking) return;

  const recipientId = resolveBookingRecipient(actor, booking);
  if (!recipientId) return;

  await createNotification({
    userId: recipientId,
    type: "booking",
    title: "New appointment request",
    body: `${booking.clientName} requested ${booking.serviceName}.`,
    href: `/dashboard/appointments?booking=${booking.id}`,
    eventKey: `booking:${booking.id}:requested`,
  });
}

export async function notifyBookingStatusChanged({
  bookingId,
  actor,
  status,
  action,
  version,
}: {
  bookingId: string;
  actor: AuthenticatedDbUser;
  status: BookingStatus;
  action: BookingAction;
  version: number;
}) {
  const booking = await getBookingParticipantContext(bookingId);
  if (!booking) return;

  const recipientId = resolveBookingRecipient(actor, booking);
  if (!recipientId) return;

  const eventLabel = action === "reschedule" ? "rescheduled" : statusLabel(status);
  await createNotification({
    userId: recipientId,
    type: "booking",
    title: `Appointment ${eventLabel}`,
    body: `${booking.serviceName} with ${
      actor.id === booking.clientUserId ? booking.clientName : booking.providerName
    } was ${eventLabel}.`,
    href: `/dashboard/appointments?booking=${booking.id}`,
    eventKey: `booking:${booking.id}:${version}:${action}`,
  });
}

function statusLabel(status: BookingStatus) {
  const labels: Record<BookingStatus, string> = {
    requested: "requested",
    confirmed: "confirmed",
    declined: "declined",
    cancelled: "cancelled",
    completed: "completed",
    no_show: "marked no-show",
  };
  return labels[status];
}
