import "server-only";

import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  providerVerifications,
  verificationEvidence,
  verificationStatusHistory,
} from "@/db/schema";
import type { BookingProviderDTO } from "@/lib/booking-domain";
import type { AuthenticatedDbUser } from "@/lib/authenticated-user";
import { hasVerificationEvidenceProof } from "@/lib/verification-domain";
import type {
  ProviderVerificationDTO,
  ProviderVerificationWorkspaceDTO,
  VerificationEvidenceDTO,
  VerificationEvidenceType,
  VerificationStatusHistoryDTO,
} from "@/lib/verification-domain";

export function getRequiredEvidenceTypes(
  providerType: BookingProviderDTO["type"]
): VerificationEvidenceType[] {
  return providerType === "salon"
    ? ["identity", "business_license", "location"]
    : ["identity", "portfolio_proof", "professional_credential"];
}

export async function ensureProviderVerification(
  provider: Pick<BookingProviderDTO, "id" | "type" | "name">,
  user: Pick<AuthenticatedDbUser, "id">
) {
  await db
    .insert(providerVerifications)
    .values({
      providerId: provider.id,
      ownerUserId: user.id,
      status: "draft",
    })
    .onConflictDoNothing({ target: providerVerifications.providerId });

  const [verification] = await db
    .select({
      id: providerVerifications.id,
      providerId: providerVerifications.providerId,
      status: providerVerifications.status,
      submittedAt: providerVerifications.submittedAt,
      reviewedAt: providerVerifications.reviewedAt,
      expiresAt: providerVerifications.expiresAt,
      adminNote: providerVerifications.adminNote,
      createdAt: providerVerifications.createdAt,
      updatedAt: providerVerifications.updatedAt,
    })
    .from(providerVerifications)
    .where(eq(providerVerifications.providerId, provider.id))
    .limit(1);

  if (!verification) {
    throw new Error("Provider verification could not be initialized");
  }

  return verification;
}

export async function getProviderVerificationWorkspace(
  provider: BookingProviderDTO,
  user: Pick<AuthenticatedDbUser, "id">
): Promise<ProviderVerificationWorkspaceDTO> {
  const verification = await ensureProviderVerification(provider, user);

  const [evidenceRows, historyRows] = await Promise.all([
    db
      .select({
        id: verificationEvidence.id,
        type: verificationEvidence.type,
        title: verificationEvidence.title,
        description: verificationEvidence.description,
        evidenceUrl: verificationEvidence.evidenceUrl,
        status: verificationEvidence.status,
        reviewerNote: verificationEvidence.reviewerNote,
        createdAt: verificationEvidence.createdAt,
        updatedAt: verificationEvidence.updatedAt,
      })
      .from(verificationEvidence)
      .where(eq(verificationEvidence.verificationId, verification.id))
      .orderBy(desc(verificationEvidence.createdAt)),
    db
      .select({
        id: verificationStatusHistory.id,
        previousStatus: verificationStatusHistory.previousStatus,
        newStatus: verificationStatusHistory.newStatus,
        note: verificationStatusHistory.note,
        createdAt: verificationStatusHistory.createdAt,
      })
      .from(verificationStatusHistory)
      .where(eq(verificationStatusHistory.verificationId, verification.id))
      .orderBy(desc(verificationStatusHistory.createdAt)),
  ]);

  const requiredEvidence = getRequiredEvidenceTypes(provider.type);
  const checklistEligibleStatuses = new Set(["submitted", "under_review", "approved"]);
  const submittedTypes = new Set(
    evidenceRows
      .filter(
        (item) =>
          requiredEvidence.includes(item.type) &&
          checklistEligibleStatuses.has(item.status) &&
          hasVerificationEvidenceProof(item)
      )
      .map((item) => item.type)
  );

  return {
    verification: mapVerification(verification, provider),
    evidence: evidenceRows.map(mapEvidence),
    history: historyRows.map(mapHistory),
    requiredEvidence,
    completion: {
      submittedRequiredCount: submittedTypes.size,
      requiredCount: requiredEvidence.length,
      percent: Math.round((submittedTypes.size / requiredEvidence.length) * 100),
    },
  };
}

export async function getVerificationByProviderId(providerId: string) {
  const [verification] = await db
    .select({
      id: providerVerifications.id,
      providerId: providerVerifications.providerId,
      ownerUserId: providerVerifications.ownerUserId,
      status: providerVerifications.status,
      submittedAt: providerVerifications.submittedAt,
      reviewedAt: providerVerifications.reviewedAt,
      expiresAt: providerVerifications.expiresAt,
      adminNote: providerVerifications.adminNote,
      createdAt: providerVerifications.createdAt,
      updatedAt: providerVerifications.updatedAt,
    })
    .from(providerVerifications)
    .where(eq(providerVerifications.providerId, providerId))
    .limit(1);

  return verification ?? null;
}

export async function getEvidenceTypesForVerification(
  verificationId: string,
  requiredEvidence: VerificationEvidenceType[]
) {
  const rows = await db
    .select({
      type: verificationEvidence.type,
      description: verificationEvidence.description,
      evidenceUrl: verificationEvidence.evidenceUrl,
    })
    .from(verificationEvidence)
    .where(
      and(
        eq(verificationEvidence.verificationId, verificationId),
        inArray(verificationEvidence.type, requiredEvidence),
        inArray(verificationEvidence.status, [
          "submitted",
          "under_review",
          "approved",
        ])
      )
    );

  return rows
    .filter((row) => requiredEvidence.includes(row.type) && hasVerificationEvidenceProof(row))
    .map((row) => row.type);
}

function mapVerification(
  row: Awaited<ReturnType<typeof ensureProviderVerification>>,
  provider: BookingProviderDTO
): ProviderVerificationDTO {
  return {
    id: row.id,
    providerId: row.providerId,
    providerName: provider.name,
    providerType: provider.type,
    status: row.status,
    submittedAt: row.submittedAt?.toISOString() ?? null,
    reviewedAt: row.reviewedAt?.toISOString() ?? null,
    expiresAt: row.expiresAt?.toISOString() ?? null,
    adminNote: row.adminNote ?? "",
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function mapEvidence(row: {
  id: string;
  type: VerificationEvidenceType;
  title: string;
  description: string | null;
  evidenceUrl: string | null;
  status: VerificationEvidenceDTO["status"];
  reviewerNote: string | null;
  createdAt: Date;
  updatedAt: Date;
}): VerificationEvidenceDTO {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description ?? "",
    evidenceUrl: row.evidenceUrl ?? "",
    status: row.status,
    reviewerNote: row.reviewerNote ?? "",
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function mapHistory(row: {
  id: string;
  previousStatus: VerificationStatusHistoryDTO["previousStatus"];
  newStatus: VerificationStatusHistoryDTO["newStatus"];
  note: string | null;
  createdAt: Date;
}): VerificationStatusHistoryDTO {
  return {
    id: row.id,
    previousStatus: row.previousStatus,
    newStatus: row.newStatus,
    note: row.note ?? "",
    createdAt: row.createdAt.toISOString(),
  };
}
