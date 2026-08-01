import "server-only";

import { and, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "@/db";
import {
  bookings,
  braiders,
  ratings,
  salons,
  serviceProviders,
  users,
} from "@/db/schema";
import type { AuthenticatedDbUser } from "@/lib/authenticated-user";

const reviewClientUser = alias(users, "provider_review_client_user");

export interface ProviderReviewActionContext {
  ratingId: string;
  bookingId: string;
  serviceName: string;
  clientUserId: string;
  clientName: string;
  providerType: "salon" | "braider";
}

export async function getProviderReviewActionContext(
  reviewId: string,
  user: Pick<AuthenticatedDbUser, "id" | "role">
): Promise<ProviderReviewActionContext | null> {
  if (user.role !== "salon_owner" && user.role !== "braider") return null;

  const [row] = await db
    .select({
      ratingId: ratings.id,
      bookingId: bookings.id,
      serviceName: bookings.serviceName,
      clientUserId: reviewClientUser.id,
      clientFirstName: reviewClientUser.firstName,
      clientLastName: reviewClientUser.lastName,
      providerType: serviceProviders.providerType,
      salonOwnerId: salons.ownerId,
      braiderUserId: braiders.userId,
    })
    .from(ratings)
    .innerJoin(bookings, eq(ratings.bookingId, bookings.id))
    .innerJoin(serviceProviders, eq(bookings.providerId, serviceProviders.id))
    .innerJoin(reviewClientUser, eq(ratings.reviewerId, reviewClientUser.id))
    .leftJoin(salons, eq(serviceProviders.salonId, salons.id))
    .leftJoin(braiders, eq(serviceProviders.braiderId, braiders.id))
    .where(and(eq(ratings.id, reviewId), eq(bookings.status, "completed")))
    .limit(1);

  if (!row) return null;

  const ownsSalonReview =
    row.providerType === "salon" &&
    user.role === "salon_owner" &&
    row.salonOwnerId === user.id;
  const ownsBraiderReview =
    row.providerType === "braider" &&
    user.role === "braider" &&
    row.braiderUserId === user.id;

  if (!ownsSalonReview && !ownsBraiderReview) return null;

  return {
    ratingId: row.ratingId,
    bookingId: row.bookingId,
    serviceName: row.serviceName,
    clientUserId: row.clientUserId,
    clientName: `${row.clientFirstName} ${row.clientLastName}`.trim(),
    providerType: row.providerType,
  };
}
