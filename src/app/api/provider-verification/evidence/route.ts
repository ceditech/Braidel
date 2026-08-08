import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { verificationEvidence } from "@/db/schema";
import { getProviderForUser } from "@/db/booking-queries";
import { ensureProviderVerification } from "@/db/verification-queries";
import { getAuthenticatedDbUser } from "@/lib/authenticated-user";
import type { VerificationEvidenceType } from "@/lib/verification-domain";

const VALID_EVIDENCE_TYPES = new Set<VerificationEvidenceType>([
  "identity",
  "business_license",
  "portfolio_proof",
  "location",
  "professional_credential",
  "other",
]);

const LOCKED_STATUSES = new Set(["submitted", "under_review", "verified", "revoked"]);

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEvidenceUrl(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedDbUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role === "client") {
    return NextResponse.json({ error: "Provider account required" }, { status: 403 });
  }

  const provider = await getProviderForUser(user);
  if (!provider) {
    return NextResponse.json({ error: "Provider profile not found" }, { status: 404 });
  }

  const verification = await ensureProviderVerification(provider, user);
  if (LOCKED_STATUSES.has(verification.status)) {
    return NextResponse.json(
      { error: "Verification is locked while it is submitted or approved" },
      { status: 409 }
    );
  }

  const payload = await req.json().catch(() => ({}));
  const type = stringValue(payload.type) as VerificationEvidenceType;
  const title = stringValue(payload.title);
  const description = stringValue(payload.description);
  const evidenceUrl = stringValue(payload.evidenceUrl);

  if (!VALID_EVIDENCE_TYPES.has(type)) {
    return NextResponse.json({ error: "Choose an evidence type" }, { status: 400 });
  }
  if (title.length < 3 || title.length > 140) {
    return NextResponse.json(
      { error: "Evidence title must be between 3 and 140 characters" },
      { status: 400 }
    );
  }
  if (description.length > 1200) {
    return NextResponse.json(
      { error: "Evidence description cannot exceed 1200 characters" },
      { status: 400 }
    );
  }
  if (evidenceUrl.length > 500 || !isValidEvidenceUrl(evidenceUrl)) {
    return NextResponse.json(
      { error: "Evidence link must be a valid http or https URL" },
      { status: 400 }
    );
  }

  const [evidence] = await db
    .insert(verificationEvidence)
    .values({
      verificationId: verification.id,
      providerId: provider.id,
      submittedByUserId: user.id,
      type,
      title,
      description: description || null,
      evidenceUrl: evidenceUrl || null,
    })
    .returning({
      id: verificationEvidence.id,
      type: verificationEvidence.type,
      title: verificationEvidence.title,
      description: verificationEvidence.description,
      evidenceUrl: verificationEvidence.evidenceUrl,
      status: verificationEvidence.status,
      reviewerNote: verificationEvidence.reviewerNote,
      createdAt: verificationEvidence.createdAt,
      updatedAt: verificationEvidence.updatedAt,
    });

  revalidatePath("/dashboard/verification");

  return NextResponse.json({
    evidence: {
      id: evidence.id,
      type: evidence.type,
      title: evidence.title,
      description: evidence.description ?? "",
      evidenceUrl: evidence.evidenceUrl ?? "",
      status: evidence.status,
      reviewerNote: evidence.reviewerNote ?? "",
      createdAt: evidence.createdAt.toISOString(),
      updatedAt: evidence.updatedAt.toISOString(),
    },
  });
}
