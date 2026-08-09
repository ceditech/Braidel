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

export const MIN_VERIFICATION_PROOF_DESCRIPTION_LENGTH = 40;

export const VERIFICATION_EVIDENCE_GUIDANCE: Record<
  VerificationEvidenceType,
  {
    purpose: string;
    acceptedLinks: string;
    fallbackProof: string;
  }
> = {
  identity: {
    purpose: "Confirms the provider or business owner is a real person tied to this account.",
    acceptedLinks:
      "A secure upload link, provider profile page, professional directory, or other reviewer-accessible reference.",
    fallbackProof:
      "If no link is available, describe the identity proof you can provide during review without posting sensitive ID numbers.",
  },
  business_license: {
    purpose: "Shows the salon or provider has legitimate business standing where applicable.",
    acceptedLinks:
      "State business registry, city license lookup, permit profile, business website, or secure document upload.",
    fallbackProof:
      "If documents are offline, summarize the registration, issuing authority, business name, and how Braidel can verify it.",
  },
  portfolio_proof: {
    purpose: "Shows the braider owns or can represent the work submitted in their portfolio.",
    acceptedLinks:
      "Portfolio website, Instagram/TikTok profile, public gallery, client-facing booking profile, or secure upload folder.",
    fallbackProof:
      "If no public link exists, describe the portfolio source, sample work, client references, or upload plan for review.",
  },
  location: {
    purpose: "Confirms where the salon operates or where the provider accepts appointments.",
    acceptedLinks:
      "Business website, Google/Apple listing, state/city listing, lease-safe proof link, or secure upload.",
    fallbackProof:
      "If the address is sensitive, describe the service area, operating city, and what private document can verify it.",
  },
  professional_credential: {
    purpose: "Supports training, experience, specialty skill, certification, or professional history claims.",
    acceptedLinks:
      "Certification page, school/training profile, professional profile, portfolio page, or secure document upload.",
    fallbackProof:
      "If no credential link exists, describe training, years of work, specialty evidence, references, or reviewable documents.",
  },
  other: {
    purpose: "Adds context the review team should consider for a fair verification decision.",
    acceptedLinks:
      "Any reviewer-accessible URL that supports the claim, including secure upload links.",
    fallbackProof:
      "If no link exists, write a clear explanation of what can be verified and how.",
  },
};

export function hasVerificationEvidenceProof(input: {
  description?: string | null;
  evidenceUrl?: string | null;
}) {
  return Boolean(input.evidenceUrl?.trim()) ||
    (input.description?.trim().length ?? 0) >= MIN_VERIFICATION_PROOF_DESCRIPTION_LENGTH;
}
