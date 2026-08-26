import "server-only";

import { desc, eq, inArray, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "@/db";
import {
  bookingPayments,
  bookings,
  braiders,
  marketplaceAdminActions,
  messages,
  notifications,
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
  AdminKpiDTO,
  AdminReviewReportQueueItemDTO,
  AdminUserDTO,
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
  const [kpis, usersList, verifications, reviewReports, [completedDecisions]] = await Promise.all([
    getAdminKpis(),
    getAdminUsers(),
    getAdminVerificationQueue(),
    getAdminReviewReportQueue(),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(marketplaceAdminActions),
  ]);

  return {
    kpis,
    users: usersList,
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

export async function getAdminKpis(): Promise<AdminKpiDTO> {
  const [
    [userCounts],
    [providerCounts],
    [messageCounts],
    [notificationCounts],
    [bookingCounts],
    [moneyCounts],
  ] = await Promise.all([
    db
      .select({
        total: sql<number>`count(*)::int`,
        active: sql<number>`count(*) filter (where ${users.deletedAt} is null and ${users.accountStatus} = 'active')::int`,
        suspended: sql<number>`count(*) filter (where ${users.deletedAt} is null and ${users.accountStatus} = 'suspended')::int`,
        deleted: sql<number>`count(*) filter (where ${users.deletedAt} is not null)::int`,
        salons: sql<number>`count(*) filter (where ${users.role} = 'salon_owner' and ${users.deletedAt} is null and ${users.accountStatus} = 'active')::int`,
        braiders: sql<number>`count(*) filter (where ${users.role} = 'braider' and ${users.deletedAt} is null and ${users.accountStatus} = 'active')::int`,
        clients: sql<number>`count(*) filter (where ${users.role} = 'client' and ${users.deletedAt} is null and ${users.accountStatus} = 'active')::int`,
        admins: sql<number>`count(*) filter (where ${users.role} = 'admin' and ${users.deletedAt} is null and ${users.accountStatus} = 'active')::int`,
      })
      .from(users),
    db
      .select({
        salons: sql<number>`count(*)::int`,
        verifiedSalons: sql<number>`count(*) filter (where ${salons.isVerified} = true)::int`,
      })
      .from(salons),
    db
      .select({
        total: sql<number>`count(*)::int`,
        last7Days: sql<number>`count(*) filter (where ${messages.createdAt} >= now() - interval '7 days')::int`,
      })
      .from(messages),
    db
      .select({
        total: sql<number>`count(*)::int`,
        unread: sql<number>`count(*) filter (where ${notifications.readAt} is null)::int`,
        processed: sql<number>`count(*) filter (where ${notifications.readAt} is not null)::int`,
      })
      .from(notifications),
    db
      .select({
        total: sql<number>`count(*)::int`,
        requested: sql<number>`count(*) filter (where ${bookings.status} = 'requested')::int`,
        confirmed: sql<number>`count(*) filter (where ${bookings.status} = 'confirmed')::int`,
        completed: sql<number>`count(*) filter (where ${bookings.status} = 'completed')::int`,
        cancelled: sql<number>`count(*) filter (where ${bookings.status} = 'cancelled')::int`,
        declined: sql<number>`count(*) filter (where ${bookings.status} = 'declined')::int`,
        noShow: sql<number>`count(*) filter (where ${bookings.status} = 'no_show')::int`,
      })
      .from(bookings),
    db
      .select({
        bookingCommissionsCents: sql<number>`coalesce(sum(${bookingPayments.applicationFeeCents}) filter (where ${bookingPayments.status} in ('succeeded', 'partially_refunded')), 0)::int`,
      })
      .from(bookingPayments),
  ]);

  const providerBraiderCounts = await db
    .select({
      braiders: sql<number>`count(*)::int`,
      verifiedBraiders: sql<number>`count(*) filter (where ${braiders.isVerified} = true)::int`,
    })
    .from(braiders);

  const activeUsers = userCounts?.active ?? 0;
  const share = (count: number) =>
    activeUsers > 0 ? Math.round((count / activeUsers) * 100) : 0;

  return {
    users: {
      total: userCounts?.total ?? 0,
      active: activeUsers,
      suspended: userCounts?.suspended ?? 0,
      deleted: userCounts?.deleted ?? 0,
      salons: userCounts?.salons ?? 0,
      braiders: userCounts?.braiders ?? 0,
      clients: userCounts?.clients ?? 0,
      admins: userCounts?.admins ?? 0,
      salonRate: share(userCounts?.salons ?? 0),
      braiderRate: share(userCounts?.braiders ?? 0),
      clientRate: share(userCounts?.clients ?? 0),
    },
    providers: {
      salons: providerCounts?.salons ?? 0,
      braiders: providerBraiderCounts[0]?.braiders ?? 0,
      verifiedSalons: providerCounts?.verifiedSalons ?? 0,
      verifiedBraiders: providerBraiderCounts[0]?.verifiedBraiders ?? 0,
    },
    messages: {
      total: messageCounts?.total ?? 0,
      last7Days: messageCounts?.last7Days ?? 0,
    },
    notifications: {
      total: notificationCounts?.total ?? 0,
      unread: notificationCounts?.unread ?? 0,
      processed: notificationCounts?.processed ?? 0,
    },
    bookings: {
      total: bookingCounts?.total ?? 0,
      requested: bookingCounts?.requested ?? 0,
      confirmed: bookingCounts?.confirmed ?? 0,
      completed: bookingCounts?.completed ?? 0,
      cancelled: bookingCounts?.cancelled ?? 0,
      declined: bookingCounts?.declined ?? 0,
      noShow: bookingCounts?.noShow ?? 0,
    },
    money: {
      bookingCommissionsCents: moneyCounts?.bookingCommissionsCents ?? 0,
      affiliateCommissionsCents: 0,
      subscriptionEarningsCents: 0,
    },
  };
}

export async function getAdminUsers(): Promise<AdminUserDTO[]> {
  const rows = await db
    .select({
      id: users.id,
      role: users.role,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      avatarUrl: users.avatarUrl,
      onboardedAt: users.onboardedAt,
      deletedAt: users.deletedAt,
      accountStatus: users.accountStatus,
      providerVisibility: serviceProviders.visibility,
      createdAt: users.createdAt,
      salonName: salons.name,
      braiderSlug: braiders.slug,
      clientCity: sql<string | null>`null`,
    })
    .from(users)
    .leftJoin(salons, eq(users.id, salons.ownerId))
    .leftJoin(braiders, eq(users.id, braiders.userId))
    .leftJoin(
      serviceProviders,
      or(eq(serviceProviders.salonId, salons.id), eq(serviceProviders.braiderId, braiders.id))
    )
    .orderBy(desc(users.createdAt))
    .limit(80);

  return rows.map((row) => ({
    id: row.id,
    role: row.role,
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    avatarUrl: row.avatarUrl ?? "",
    onboardedAt: row.onboardedAt?.toISOString() ?? null,
    deletedAt: row.deletedAt?.toISOString() ?? null,
    accountStatus: row.accountStatus,
    providerVisibility: row.providerVisibility ?? null,
    createdAt: row.createdAt.toISOString(),
    profileLabel: roleLabel(row.role),
    profileName:
      row.salonName ??
      (row.role === "braider" ? row.braiderSlug ?? "Braider profile" : "") ??
      "",
  }));
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

function roleLabel(role: AdminUserDTO["role"]) {
  if (role === "salon_owner") return "Salon owner";
  if (role === "braider") return "Braider";
  if (role === "client") return "Client";
  return "Admin";
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
