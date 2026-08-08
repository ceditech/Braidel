export type ProviderVerificationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "verified"
  | "rejected"
  | "expired"
  | "revoked";

export type VerificationEvidenceType =
  | "identity"
  | "business_license"
  | "portfolio_proof"
  | "location"
  | "professional_credential"
  | "other";

export type VerificationEvidenceStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "expired";

export interface VerificationEvidenceDTO {
  id: string;
  type: VerificationEvidenceType;
  title: string;
  description: string;
  evidenceUrl: string;
  status: VerificationEvidenceStatus;
  reviewerNote: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationStatusHistoryDTO {
  id: string;
  previousStatus: ProviderVerificationStatus | null;
  newStatus: ProviderVerificationStatus;
  note: string;
  createdAt: string;
}

export interface ProviderVerificationDTO {
  id: string;
  providerId: string;
  providerName: string;
  providerType: "salon" | "braider";
  status: ProviderVerificationStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  expiresAt: string | null;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderVerificationWorkspaceDTO {
  verification: ProviderVerificationDTO;
  evidence: VerificationEvidenceDTO[];
  history: VerificationStatusHistoryDTO[];
  requiredEvidence: VerificationEvidenceType[];
  completion: {
    submittedRequiredCount: number;
    requiredCount: number;
    percent: number;
  };
}

export const VERIFICATION_EVIDENCE_LABELS: Record<VerificationEvidenceType, string> = {
  identity: "Identity",
  business_license: "Business license",
  portfolio_proof: "Portfolio proof",
  location: "Location",
  professional_credential: "Professional credential",
  other: "Other",
};

export const VERIFICATION_STATUS_LABELS: Record<ProviderVerificationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  verified: "Verified",
  rejected: "Needs changes",
  expired: "Expired",
  revoked: "Revoked",
};
