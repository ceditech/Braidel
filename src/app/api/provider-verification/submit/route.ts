import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { withBookingTransaction } from "@/db/booking-db";
import { getProviderForUser } from "@/db/booking-queries";
import {
  ensureProviderVerification,
  getEvidenceTypesForVerification,
  getRequiredEvidenceTypes,
} from "@/db/verification-queries";
import {
  providerVerifications,
  verificationStatusHistory,
} from "@/db/schema";
import { getAuthenticatedDbUser } from "@/lib/authenticated-user";
import { createNotification } from "@/lib/notifications";
import { VERIFICATION_EVIDENCE_LABELS } from "@/lib/verification-domain";

const SUBMIT_BLOCKED_STATUSES = new Set([
  "submitted",
  "under_review",
  "verified",
  "revoked",
]);

export async function POST() {
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
  if (SUBMIT_BLOCKED_STATUSES.has(verification.status)) {
    return NextResponse.json(
      { error: "This verification profile is already submitted or locked" },
      { status: 409 }
    );
  }

  const requiredEvidence = getRequiredEvidenceTypes(provider.type);
  const submittedTypes = await getEvidenceTypesForVerification(
    verification.id,
    requiredEvidence
  );
  const missing = requiredEvidence.filter((type) => !submittedTypes.includes(type));

  if (missing.length) {
    return NextResponse.json(
      {
        error: "Required evidence is missing",
        missing: missing.map((type) => VERIFICATION_EVIDENCE_LABELS[type]),
      },
      { status: 400 }
    );
  }

  const now = new Date();
  const mutation = await withBookingTransaction(async (tx) => {
    const [updated] = await tx
      .update(providerVerifications)
      .set({
        status: "submitted",
        submittedAt: now,
        updatedAt: now,
      })
      .where(eq(providerVerifications.id, verification.id))
      .returning({
        id: providerVerifications.id,
        status: providerVerifications.status,
        submittedAt: providerVerifications.submittedAt,
        updatedAt: providerVerifications.updatedAt,
      });

    const [history] = await tx
      .insert(verificationStatusHistory)
      .values({
        verificationId: verification.id,
        changedByUserId: user.id,
        previousStatus: verification.status,
        newStatus: "submitted",
        note: "Provider submitted required evidence for verification review.",
      })
      .returning({
        id: verificationStatusHistory.id,
        previousStatus: verificationStatusHistory.previousStatus,
        newStatus: verificationStatusHistory.newStatus,
        note: verificationStatusHistory.note,
        createdAt: verificationStatusHistory.createdAt,
      });

    return { updated, history };
  });

  await createNotification({
    userId: user.id,
    type: "system",
    title: "Verification submitted",
    body: `${provider.name} is ready for marketplace verification review.`,
    href: "/dashboard/verification",
    eventKey: `verification-submitted:${verification.id}:${mutation.history.id}`,
  });

  revalidatePath("/dashboard/verification");
  revalidatePath("/dashboard/notifications");

  return NextResponse.json({
    verification: {
      id: mutation.updated.id,
      status: mutation.updated.status,
      submittedAt: mutation.updated.submittedAt?.toISOString() ?? null,
      updatedAt: mutation.updated.updatedAt.toISOString(),
    },
    history: {
      id: mutation.history.id,
      previousStatus: mutation.history.previousStatus,
      newStatus: mutation.history.newStatus,
      note: mutation.history.note ?? "",
      createdAt: mutation.history.createdAt.toISOString(),
    },
  });
}
