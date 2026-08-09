import "server-only";

import { desc, eq, inArray, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "@/db";
import {
  bookings,
  braiders,
  marketplaceAdminActions,
  providerVerifications,
  ratings,
  reviewReports,
  salons,
  serviceProviders,
  users,
  verificationEvidence,
  verificationStatusHistory,
} from "@/db/schema";
import type {
  AdminReviewReportQueueItemDTO,
  AdminVerificationQueueItemDTO,
  MarketplaceAdminDashboardDTO,
} from "@/lib/admin-domain";
import type { VerificationStatusHistoryDTO } from "@/lib/verification-domain";

type VerificationHistoryRow = {
  id: string;
  previousStatus: VerificationStatusHistoryDTO["previousStatus"];
  newStatus: VerificationStatusHistoryDTO["newStatus"];
  note: string | null;
  createdAt: Date;
};

const verificationOwner = alias(users, "verification_owner_user");
const verificationReviewer = alias(users, "verification_reviewer_user");
const providerBraiderUser = alias(users, "provider_braider_user");
const reportReporter = alias(users, "review_reporter_user");

const VERIFICATION_QUEUE_STATUSES = [
  "submitted",
  "under_review",
  "rejected",
] as const;

const REVIEW_REPORT_QUEUE_STATUSES = [
  "submitted",
  "under_review",
] as const;

export async function getMarketplaceAdminDashboard(): Promise<MarketplaceAdminDashboardDTO> {
  const [verifications, reviewReports, [completedDecisions]] = await Promise.all([
    getAdminVerificationQueue(),
    getAdminReviewReportQueue(),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(marketplaceAdminActions),
  ]);

  return {
    stats: {
      pendingVerifications: verifications.filter((item) => item.status === "submitted").length,
      reportedReviews: reviewReports.filter((item) => item.status === "submitted").length,
      underReview:
        verifications.filter((item) => item.status === "under_review").length +
        reviewReports.filter((item) => item.status === "under_review").length,
      completedDecisions: completedDecisions?.count ?? 0,
    },
    verifications,
    reviewReports,
  };
}

export async function getAdminVerificationQueue(): Promise<AdminVerificationQueueItemDTO[]> {
  const rows = await db
    .select({
      id: providerVerifications.id,
      providerId: providerVerifications.providerId,
      providerType: serviceProviders.providerType,
      providerName: sql<string>`coalesce(${salons.name}, ${providerBraiderUser.firstName} || ' ' || ${providerBraiderUser.lastName}, 'Provider')`,
      ownerFirstName: verificationOwner.firstName,
      ownerLastName: verificationOwner.lastName,
      ownerEmail: verificationOwner.email,
      status: providerVerifications.status,
      submittedAt: providerVerifications.submittedAt,
      reviewedAt: providerVerifications.reviewedAt,
      expiresAt: providerVerifications.expiresAt,
      adminNote: providerVerifications.adminNote,
    })
    .from(providerVerifications)
    .innerJoin(serviceProviders, eq(providerVerifications.providerId, serviceProviders.id))
    .innerJoin(verificationOwner, eq(providerVerifications.ownerUserId, verificationOwner.id))
    .leftJoin(salons, eq(serviceProviders.salonId, salons.id))
    .leftJoin(braiders, eq(serviceProviders.braiderId, braiders.id))
    .leftJoin(providerBraiderUser, eq(braiders.userId, providerBraiderUser.id))
    .leftJoin(
      verificationReviewer,
      eq(providerVerifications.reviewerUserId, verificationReviewer.id)
    )
    .where(inArray(providerVerifications.status, VERIFICATION_QUEUE_STATUSES))
    .orderBy(desc(providerVerifications.submittedAt), desc(providerVerifications.updatedAt))
    .limit(30);

  const verificationIds = rows.map((row) => row.id);
  const evidenceRows = verificationIds.length
    ? await db
        .select({
          id: verificationEvidence.id,
          verificationId: verificationEvidence.verificationId,
          type: verificationEvidence.type,
          title: verificationEvidence.title,
          description: verificationEvidence.description,
          evidenceUrl: verificationEvidence.evidenceUrl,
          status: verificationEvidence.status,
          reviewerNote: verificationEvidence.reviewerNote,
          createdAt: verificationEvidence.createdAt,
        })
        .from(verificationEvidence)
        .where(inArray(verificationEvidence.verificationId, verificationIds))
        .orderBy(desc(verificationEvidence.createdAt))
    : [];

  const historyRows = verificationIds.length
    ? await db
        .select({
          id: verificationStatusHistory.id,
          verificationId: verificationStatusHistory.verificationId,
          previousStatus: verificationStatusHistory.previousStatus,
          newStatus: verificationStatusHistory.newStatus,
          note: verificationStatusHistory.note,
          createdAt: verificationStatusHistory.createdAt,
        })
        .from(verificationStatusHistory)
        .where(inArray(verificationStatusHistory.verificationId, verificationIds))
        .orderBy(desc(verificationStatusHistory.createdAt))
    : [];

  return rows.map((row) => {
    const evidence = evidenceRows.filter((item) => item.verificationId === row.id);
    return {
      id: row.id,
      providerId: row.providerId,
      providerName: row.providerName,
      providerType: row.providerType,
      ownerName: `${row.ownerFirstName} ${row.ownerLastName}`.trim(),
      ownerEmail: row.ownerEmail,
      status: row.status,
      submittedAt: row.submittedAt?.toISOString() ?? null,
      reviewedAt: row.reviewedAt?.toISOString() ?? null,
      expiresAt: row.expiresAt?.toISOString() ?? null,
      adminNote: row.adminNote ?? "",
      evidenceCount: evidence.length,
      evidence: evidence.map((item) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        description: item.description ?? "",
        evidenceUrl: item.evidenceUrl ?? "",
        status: item.status,
        reviewerNote: item.reviewerNote ?? "",
        createdAt: item.createdAt.toISOString(),
      })),
      history: historyRows
        .filter((item) => item.verificationId === row.id)
        .map(mapVerificationHistory),
    };
  });
}

export async function getAdminReviewReportQueue(): Promise<AdminReviewReportQueueItemDTO[]> {
  const rows = await db
    .select({
      id: reviewReports.id,
      ratingId: reviewReports.ratingId,
      providerType: sql<"salon" | "braider">`case when ${ratings.salonId} is not null then 'salon' else 'braider' end`,
      providerName: sql<string>`coalesce(${salons.name}, ${providerBraiderUser.firstName} || ' ' || ${providerBraiderUser.lastName}, 'Provider')`,
      serviceName: bookings.serviceName,
      score: ratings.score,
      reviewComment: ratings.comment,
      reporterFirstName: reportReporter.firstName,
      reporterLastName: reportReporter.lastName,
      reporterEmail: reportReporter.email,
      category: reviewReports.category,
      reason: reviewReports.reason,
      status: reviewReports.status,
      resolutionNote: reviewReports.resolutionNote,
      createdAt: reviewReports.createdAt,
      updatedAt: reviewReports.updatedAt,
    })
    .from(reviewReports)
    .innerJoin(ratings, eq(reviewReports.ratingId, ratings.id))
    .leftJoin(bookings, eq(ratings.bookingId, bookings.id))
    .innerJoin(reportReporter, eq(reviewReports.reportedByUserId, reportReporter.id))
    .leftJoin(salons, eq(ratings.salonId, salons.id))
    .leftJoin(braiders, eq(ratings.braiderId, braiders.id))
    .leftJoin(providerBraiderUser, eq(braiders.userId, providerBraiderUser.id))
    .where(inArray(reviewReports.status, REVIEW_REPORT_QUEUE_STATUSES))
    .orderBy(desc(reviewReports.createdAt))
    .limit(30);

  return rows.map((row) => ({
    id: row.id,
    ratingId: row.ratingId,
    providerName: row.providerName,
    providerType: row.providerType,
    serviceName: row.serviceName ?? "Review",
    score: row.score,
    reviewComment: row.reviewComment ?? "",
    reporterName: `${row.reporterFirstName} ${row.reporterLastName}`.trim(),
    reporterEmail: row.reporterEmail,
    category: row.category as AdminReviewReportQueueItemDTO["category"],
    reason: row.reason,
    status: row.status as AdminReviewReportQueueItemDTO["status"],
    resolutionNote: row.resolutionNote ?? "",
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function getVerificationForAdminDecision(id: string) {
  const [row] = await db
    .select({
      id: providerVerifications.id,
      ownerUserId: providerVerifications.ownerUserId,
      status: providerVerifications.status,
      reviewedAt: providerVerifications.reviewedAt,
      expiresAt: providerVerifications.expiresAt,
      providerType: serviceProviders.providerType,
      salonId: serviceProviders.salonId,
      braiderId: serviceProviders.braiderId,
    })
    .from(providerVerifications)
    .innerJoin(serviceProviders, eq(providerVerifications.providerId, serviceProviders.id))
    .where(eq(providerVerifications.id, id))
    .limit(1);

  return row ?? null;
}

export async function getReviewReportForAdminDecision(id: string) {
  const [row] = await db
    .select({
      id: reviewReports.id,
      status: reviewReports.status,
      reportedByUserId: reviewReports.reportedByUserId,
      ratingId: reviewReports.ratingId,
    })
    .from(reviewReports)
    .where(eq(reviewReports.id, id))
    .limit(1);

  return row ?? null;
}

export function adminQueuePaths() {
  return ["/dashboard/admin", "/dashboard/verification", "/dashboard/reviews"];
}

function mapVerificationHistory(item: VerificationHistoryRow): VerificationStatusHistoryDTO {
  return {
    id: item.id,
    previousStatus: item.previousStatus,
    newStatus: item.newStatus,
    note: item.note ?? "",
    createdAt: item.createdAt.toISOString(),
  };
}
