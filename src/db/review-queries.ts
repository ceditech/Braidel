import "server-only";

import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "@/db";
import {
  bookings,
  clientProfiles,
  providerReviewResponseHistory,
  providerReviewResponses,
  ratingHistory,
  ratings,
  reviewReports,
  serviceProviders,
  users,
} from "@/db/schema";
import type { BookingProviderDTO } from "@/lib/booking-domain";
import type {
  ProviderReviewDTO,
  ProviderReviewDashboardDTO,
  ProviderReviewHistoryDTO,
  ProviderReviewReportCategory,
  ProviderReviewReportDTO,
  ProviderReviewReportStatus,
  ProviderReviewResponseDTO,
  ProviderReviewResponseHistoryDTO,
} from "@/lib/review-domain";

const clientUser = alias(users, "review_client_user");

export async function getProviderReviewDashboard(
  provider: BookingProviderDTO | null,
  providerUserId?: string
): Promise<ProviderReviewDashboardDTO> {
  if (!provider) return emptyReviewDashboard(null);

  const rows = await db
    .select({
      id: ratings.id,
      bookingId: bookings.id,
      score: ratings.score,
      comment: ratings.comment,
      createdAt: ratings.createdAt,
      updatedAt: ratings.updatedAt,
      serviceName: bookings.serviceName,
      appointmentStartsAt: bookings.startsAt,
      appointmentEndsAt: bookings.endsAt,
      timezone: bookings.timezone,
      clientFirstName: clientUser.firstName,
      clientLastName: clientUser.lastName,
      clientEmail: clientUser.email,
    })
    .from(ratings)
    .innerJoin(bookings, eq(ratings.bookingId, bookings.id))
    .innerJoin(serviceProviders, eq(bookings.providerId, serviceProviders.id))
    .innerJoin(clientProfiles, eq(bookings.clientProfileId, clientProfiles.id))
    .innerJoin(clientUser, eq(clientProfiles.userId, clientUser.id))
    .where(and(eq(serviceProviders.id, provider.id), eq(bookings.status, "completed")))
    .orderBy(desc(ratings.updatedAt), desc(ratings.createdAt));

  const ratingIds = rows.map((row) => row.id);
  const historyRows = ratingIds.length
    ? await db
        .select({
          ratingId: ratingHistory.ratingId,
          action: ratingHistory.action,
          previousScore: ratingHistory.previousScore,
          previousComment: ratingHistory.previousComment,
          newScore: ratingHistory.newScore,
          newComment: ratingHistory.newComment,
          createdAt: ratingHistory.createdAt,
        })
        .from(ratingHistory)
        .where(inArray(ratingHistory.ratingId, ratingIds))
        .orderBy(asc(ratingHistory.createdAt))
    : [];

  const historyByRating = new Map<string, ProviderReviewHistoryDTO[]>();
  for (const history of historyRows) {
    const entries = historyByRating.get(history.ratingId) ?? [];
    entries.push({
      action: history.action === "updated" ? "updated" : "created",
      previousScore: history.previousScore,
      previousComment: history.previousComment ?? "",
      newScore: history.newScore,
      newComment: history.newComment ?? "",
      createdAt: toIso(history.createdAt),
    });
    historyByRating.set(history.ratingId, entries);
  }

  const responseRows = ratingIds.length
    ? await db
        .select({
          id: providerReviewResponses.id,
          ratingId: providerReviewResponses.ratingId,
          body: providerReviewResponses.body,
          createdAt: providerReviewResponses.createdAt,
          updatedAt: providerReviewResponses.updatedAt,
        })
        .from(providerReviewResponses)
        .where(inArray(providerReviewResponses.ratingId, ratingIds))
    : [];

  const responseIds = responseRows.map((response) => response.id);
  const responseHistoryRows = responseIds.length
    ? await db
        .select({
          responseId: providerReviewResponseHistory.responseId,
          action: providerReviewResponseHistory.action,
          previousBody: providerReviewResponseHistory.previousBody,
          newBody: providerReviewResponseHistory.newBody,
          createdAt: providerReviewResponseHistory.createdAt,
        })
        .from(providerReviewResponseHistory)
        .where(inArray(providerReviewResponseHistory.responseId, responseIds))
        .orderBy(asc(providerReviewResponseHistory.createdAt))
    : [];

  const responseHistoryByResponse = new Map<
    string,
    ProviderReviewResponseHistoryDTO[]
  >();
  for (const history of responseHistoryRows) {
    const entries = responseHistoryByResponse.get(history.responseId) ?? [];
    entries.push({
      action: history.action === "updated" ? "updated" : "created",
      previousBody: history.previousBody ?? "",
      newBody: history.newBody,
      createdAt: toIso(history.createdAt),
    });
    responseHistoryByResponse.set(history.responseId, entries);
  }

  const responseByRating = new Map<string, ProviderReviewResponseDTO>();
  for (const response of responseRows) {
    responseByRating.set(response.ratingId, {
      id: response.id,
      body: response.body,
      createdAt: toIso(response.createdAt),
      updatedAt: toIso(response.updatedAt),
      history: responseHistoryByResponse.get(response.id) ?? [],
    });
  }

  const reportRows =
    ratingIds.length && providerUserId
      ? await db
          .select({
            id: reviewReports.id,
            ratingId: reviewReports.ratingId,
            category: reviewReports.category,
            reason: reviewReports.reason,
            status: reviewReports.status,
            resolutionNote: reviewReports.resolutionNote,
            createdAt: reviewReports.createdAt,
            updatedAt: reviewReports.updatedAt,
          })
          .from(reviewReports)
          .where(
            and(
              inArray(reviewReports.ratingId, ratingIds),
              eq(reviewReports.reportedByUserId, providerUserId)
            )
          )
      : [];

  const reportByRating = new Map<string, ProviderReviewReportDTO>();
  for (const report of reportRows) {
    reportByRating.set(report.ratingId, {
      id: report.id,
      category: report.category as ProviderReviewReportCategory,
      reason: report.reason,
      status: report.status as ProviderReviewReportStatus,
      resolutionNote: report.resolutionNote ?? "",
      createdAt: toIso(report.createdAt),
      updatedAt: toIso(report.updatedAt),
    });
  }

  const reviews = rows.map((row) => ({
    id: row.id,
    bookingId: row.bookingId,
    score: row.score,
    comment: row.comment ?? "",
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
    serviceName: row.serviceName,
    appointmentStartsAt: toIso(row.appointmentStartsAt),
    appointmentEndsAt: toIso(row.appointmentEndsAt),
    timezone: row.timezone,
    client: {
      name: `${row.clientFirstName} ${row.clientLastName}`.trim(),
      email: row.clientEmail,
    },
    history: historyByRating.get(row.id) ?? [],
    providerResponse: responseByRating.get(row.id) ?? null,
    report: reportByRating.get(row.id) ?? null,
  }));

  return {
    provider,
    totalReviews: reviews.length,
    averageRating: average(reviews.map((review) => review.score)),
    fiveStarShare: percentage(
      reviews.filter((review) => review.score === 5).length,
      reviews.length
    ),
    editedReviews: reviews.filter((review) =>
      review.history.some((entry) => entry.action === "updated")
    ).length,
    latestReviewAt: reviews[0]?.updatedAt ?? null,
    distribution: buildDistribution(reviews),
    reviews,
  };
}

function emptyReviewDashboard(
  provider: BookingProviderDTO | null
): ProviderReviewDashboardDTO {
  return {
    provider,
    totalReviews: 0,
    averageRating: 0,
    fiveStarShare: 0,
    editedReviews: 0,
    latestReviewAt: null,
    distribution: buildDistribution([]),
    reviews: [],
  };
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function percentage(value: number, total: number) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

function buildDistribution(reviews: ProviderReviewDTO[]) {
  return ([5, 4, 3, 2, 1] as const).map((score) => {
    const count = reviews.filter((review) => review.score === score).length;
    return { score, count, percentage: percentage(count, reviews.length) };
  });
}

function toIso(value: Date) {
  return value.toISOString();
}
