import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { withBookingTransaction } from "@/db/booking-db";
import {
  adminQueuePaths,
  getVerificationForAdminDecision,
} from "@/db/admin-queries";
import {
  braiders,
  marketplaceAdminActions,
  providerVerifications,
  salons,
  verificationStatusHistory,
} from "@/db/schema";
import { getMarketplaceAdminForApi } from "@/lib/admin-auth";
import { createNotification } from "@/lib/notifications";
import type { AdminVerificationDecision } from "@/lib/admin-domain";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VALID_DECISIONS = new Set<AdminVerificationDecision>([
  "under_review",
  "verified",
  "rejected",
  "expired",
  "revoked",
]);

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid verification id" }, { status: 400 });
  }

  const admin = await getMarketplaceAdminForApi();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const payload = await req.json().catch(() => ({}));
  const decision = stringValue(payload.decision) as AdminVerificationDecision;
  const note = stringValue(payload.note);

  if (!VALID_DECISIONS.has(decision)) {
    return NextResponse.json({ error: "Choose a valid decision" }, { status: 400 });
  }
  if ((decision === "rejected" || decision === "revoked") && note.length < 10) {
    return NextResponse.json(
      { error: "Add a clear reviewer note before rejecting or revoking" },
      { status: 400 }
    );
  }

  const verification = await getVerificationForAdminDecision(id);
  if (!verification) {
    return NextResponse.json({ error: "Verification not found" }, { status: 404 });
  }
  if (verification.status === decision) {
    return NextResponse.json(
      { error: "Verification is already in that status" },
      { status: 409 }
    );
  }

  const now = new Date();
  await withBookingTransaction(async (tx) => {
    await tx
      .update(providerVerifications)
      .set({
        status: decision,
        reviewerUserId: admin.id,
        reviewedAt: decision === "under_review" ? verification.reviewedAt : now,
        adminNote: note || null,
        expiresAt:
          decision === "verified"
            ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
            : verification.expiresAt,
        updatedAt: now,
      })
      .where(eq(providerVerifications.id, id));

    await tx.insert(verificationStatusHistory).values({
      verificationId: id,
      changedByUserId: admin.id,
      previousStatus: verification.status,
      newStatus: decision,
      note: note || `Admin marked verification ${decision.replace("_", " ")}.`,
    });

    await tx.insert(marketplaceAdminActions).values({
      actorUserId: admin.id,
      targetType: "provider_verification",
      targetId: id,
      action: `verification_${decision}`,
      previousState: verification.status,
      newState: decision,
      note: note || null,
    });

    if (verification.providerType === "salon" && verification.salonId) {
      await tx
        .update(salons)
        .set({ isVerified: decision === "verified", updatedAt: now })
        .where(eq(salons.id, verification.salonId));
    }
    if (verification.providerType === "braider" && verification.braiderId) {
      await tx
        .update(braiders)
        .set({ isVerified: decision === "verified", updatedAt: now })
        .where(eq(braiders.id, verification.braiderId));
    }
  });

  await createNotification({
    userId: verification.ownerUserId,
    type: "system",
    title: "Verification status updated",
    body: `Your verification is now ${decision.replace("_", " ")}.`,
    href: "/dashboard/verification",
    eventKey: `verification-admin:${id}:${decision}:${now.toISOString()}`,
  });

  for (const path of adminQueuePaths()) revalidatePath(path);
  revalidatePath("/dashboard/notifications");
  revalidatePath("/find-braiders");
  revalidatePath("/find-salons");

  return NextResponse.json({ ok: true, status: decision });
}
