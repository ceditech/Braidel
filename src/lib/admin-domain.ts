import type {
  ProviderVerificationStatus,
  VerificationEvidenceStatus,
  VerificationEvidenceType,
  VerificationStatusHistoryDTO,
} from "@/lib/verification-domain";
import type {
  ProviderReviewReportCategory,
  ProviderReviewReportStatus,
} from "@/lib/review-domain";

export type AdminVerificationDecision =
  | "under_review"
  | "verified"
  | "rejected"
  | "expired"
  | "revoked";

export type AdminReviewReportDecision =
  | "under_review"
  | "resolved"
  | "dismissed";

export interface AdminEvidenceDTO {
  id: string;
  type: VerificationEvidenceType;
  title: string;
  description: string;
  evidenceUrl: string;
  status: VerificationEvidenceStatus;
  reviewerNote: string;
  createdAt: string;
}

export interface AdminVerificationQueueItemDTO {
  id: string;
  providerId: string;
  providerName: string;
  providerType: "salon" | "braider";
  ownerName: string;
  ownerEmail: string;
  status: ProviderVerificationStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  expiresAt: string | null;
  adminNote: string;
  evidenceCount: number;
  evidence: AdminEvidenceDTO[];
  history: VerificationStatusHistoryDTO[];
}

export interface AdminReviewReportQueueItemDTO {
  id: string;
  ratingId: string;
  providerName: string;
  providerType: "salon" | "braider";
  serviceName: string;
  score: number;
  reviewComment: string;
  reporterName: string;
  reporterEmail: string;
  category: ProviderReviewReportCategory;
  reason: string;
  status: ProviderReviewReportStatus;
  resolutionNote: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminKpiDTO {
  users: {
    total: number;
    active: number;
    deactivated: number;
    salons: number;
    braiders: number;
    clients: number;
    admins: number;
    salonRate: number;
    braiderRate: number;
    clientRate: number;
  };
  providers: {
    salons: number;
    braiders: number;
    verifiedSalons: number;
    verifiedBraiders: number;
  };
  messages: {
    total: number;
    last7Days: number;
  };
  notifications: {
    total: number;
    unread: number;
    processed: number;
  };
  bookings: {
    total: number;
    requested: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    declined: number;
    noShow: number;
  };
  money: {
    bookingCommissionsCents: number;
    affiliateCommissionsCents: number;
    subscriptionEarningsCents: number;
  };
}

export interface AdminUserDTO {
  id: string;
  role: "salon_owner" | "braider" | "client" | "admin";
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  onboardedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  profileLabel: string;
  profileName: string;
}

export interface MarketplaceAdminDashboardDTO {
  kpis: AdminKpiDTO;
  users: AdminUserDTO[];
  stats: {
    pendingVerifications: number;
    reportedReviews: number;
    underReview: number;
    completedDecisions: number;
  };
  verifications: AdminVerificationQueueItemDTO[];
  reviewReports: AdminReviewReportQueueItemDTO[];
}
