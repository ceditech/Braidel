import "server-only";

import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "@/db";
import {
  bookings,
  braiders,
  clientProfiles,
  serviceProviders,
  salons,
  users,
} from "@/db/schema";
import type { AuthenticatedDbUser } from "@/lib/authenticated-user";
import type { BookingStatus } from "@/lib/booking-domain";

const bookingClientUser = alias(users, "booking_context_client_user");
const bookingBraiderUser = alias(users, "booking_context_braider_user");
const bookingSalonOwner = alias(users, "booking_context_salon_owner");

export interface BookingParticipantContext {
  id: string;
  status: BookingStatus;
  serviceName: string;
  startsAt: Date;
  providerType: "salon" | "braider";
  providerName: string;
  clientProfileId: string;
  clientUserId: string;
  clientName: string;
  salonId: string | null;
  salonOwnerId: string | null;
  braiderId: string | null;
  braiderUserId: string | null;
}

export async function getBookingParticipantContext(
  bookingId: string
): Promise<BookingParticipantContext | null> {
  const [row] = await db
    .select({
      id: bookings.id,
      status: bookings.status,
      serviceName: bookings.serviceName,
      startsAt: bookings.startsAt,
      providerType: serviceProviders.providerType,
      clientProfileId: clientProfiles.id,
      clientUserId: bookingClientUser.id,
      clientFirstName: bookingClientUser.firstName,
      clientLastName: bookingClientUser.lastName,
      salonId: salons.id,
      salonName: salons.name,
      salonOwnerId: bookingSalonOwner.id,
      braiderId: braiders.id,
      braiderFirstName: bookingBraiderUser.firstName,
      braiderLastName: bookingBraiderUser.lastName,
      braiderUserId: bookingBraiderUser.id,
    })
    .from(bookings)
    .innerJoin(clientProfiles, eq(bookings.clientProfileId, clientProfiles.id))
    .innerJoin(bookingClientUser, eq(clientProfiles.userId, bookingClientUser.id))
    .innerJoin(serviceProviders, eq(bookings.providerId, serviceProviders.id))
    .leftJoin(salons, eq(serviceProviders.salonId, salons.id))
    .leftJoin(bookingSalonOwner, eq(salons.ownerId, bookingSalonOwner.id))
    .leftJoin(braiders, eq(serviceProviders.braiderId, braiders.id))
    .leftJoin(bookingBraiderUser, eq(braiders.userId, bookingBraiderUser.id))
    .where(eq(bookings.id, bookingId))
    .limit(1);

  if (!row) return null;

  const braiderName = `${row.braiderFirstName ?? ""} ${
    row.braiderLastName ?? ""
  }`.trim();

  return {
    id: row.id,
    status: row.status,
    serviceName: row.serviceName,
    startsAt: row.startsAt,
    providerType: row.providerType,
    providerName:
      row.providerType === "salon"
        ? row.salonName ?? "Salon"
        : braiderName || "Braider",
    clientProfileId: row.clientProfileId,
    clientUserId: row.clientUserId,
    clientName: `${row.clientFirstName} ${row.clientLastName}`.trim(),
    salonId: row.salonId,
    salonOwnerId: row.salonOwnerId,
    braiderId: row.braiderId,
    braiderUserId: row.braiderUserId,
  };
}

export function resolveBookingRecipient(
  user: Pick<AuthenticatedDbUser, "id" | "role">,
  booking: BookingParticipantContext
) {
  const providerUserId =
    booking.providerType === "salon"
      ? booking.salonOwnerId
      : booking.braiderUserId;

  if (user.id === booking.clientUserId) return providerUserId;
  if (providerUserId && user.id === providerUserId) return booking.clientUserId;

  if (process.env.NODE_ENV !== "production") {
    if (user.role === "client") return providerUserId;
    if (user.role === "salon_owner" || user.role === "braider") {
      return booking.clientUserId;
    }
  }

  return null;
}

export function resolveBookingReviewTarget(
  user: Pick<AuthenticatedDbUser, "id" | "role">,
  booking: BookingParticipantContext
) {
  if (user.role !== "client" || user.id !== booking.clientUserId) return null;

  if (booking.providerType === "salon" && booking.salonId) {
    return {
      salonId: booking.salonId,
      braiderId: null,
      recipientId: booking.salonOwnerId,
      targetName: booking.providerName,
    };
  }

  if (booking.providerType === "braider" && booking.braiderId) {
    return {
      salonId: null,
      braiderId: booking.braiderId,
      recipientId: booking.braiderUserId,
      targetName: booking.providerName,
    };
  }

  return null;
}
