import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { withBookingTransaction } from "@/db/booking-db";
import {
  adminQueuePaths,
  getReviewReportForAdminDecision,
} from "@/db/admin-queries";
import { marketplaceAdminActions, reviewReports } from "@/db/schema";
import { getMarketplaceAdminForApi } from "@/lib/admin-auth";
import { createNotification } from "@/lib/notifications";
import type { AdminReviewReportDecision } from "@/lib/admin-domain";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VALID_DECISIONS = new Set<AdminReviewReportDecision>([
  "under_review",
  "resolved",
  "dismissed",
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
    return NextResponse.json({ error: "Invalid report id" }, { status: 400 });
  }

  const admin = await getMarketplaceAdminForApi();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const payload = await req.json().catch(() => ({}));
  const decision = stringValue(payload.decision) as AdminReviewReportDecision;
  const note = stringValue(payload.note);

  if (!VALID_DECISIONS.has(decision)) {
    return NextResponse.json({ error: "Choose a valid decision" }, { status: 400 });
  }
  if ((decision === "resolved" || decision === "dismissed") && note.length < 10) {
    return NextResponse.json(
      { error: "Add a clear resolution note before closing this report" },
      { status: 400 }
    );
  }

  const report = await getReviewReportForAdminDecision(id);
  if (!report) {
    return NextResponse.json({ error: "Review report not found" }, { status: 404 });
  }
  if (report.status === decision) {
    return NextResponse.json(
      { error: "Report is already in that status" },
      { status: 409 }
    );
  }

  const now = new Date();
  await withBookingTransaction(async (tx) => {
    await tx
      .update(reviewReports)
      .set({
        status: decision,
        resolutionNote: note || null,
        updatedAt: now,
      })
      .where(eq(reviewReports.id, id));

    await tx.insert(marketplaceAdminActions).values({
      actorUserId: admin.id,
      targetType: "review_report",
      targetId: id,
      action: `review_report_${decision}`,
      previousState: report.status,
      newState: decision,
      note: note || null,
    });
  });

  await createNotification({
    userId: report.reportedByUserId,
    type: "review",
    title: "Review report updated",
    body: `Your review report is now ${decision.replace("_", " ")}.`,
    href: "/dashboard/reviews",
    eventKey: `review-report-admin:${id}:${decision}:${now.toISOString()}`,
  });

  for (const path of adminQueuePaths()) revalidatePath(path);
  revalidatePath("/dashboard/notifications");

  return NextResponse.json({ ok: true, status: decision });
}
