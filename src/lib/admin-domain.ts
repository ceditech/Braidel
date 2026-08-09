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

export interface MarketplaceAdminDashboardDTO {
  stats: {
    pendingVerifications: number;
    reportedReviews: number;
    underReview: number;
    completedDecisions: number;
  };
  verifications: AdminVerificationQueueItemDTO[];
  reviewReports: AdminReviewReportQueueItemDTO[];
}
