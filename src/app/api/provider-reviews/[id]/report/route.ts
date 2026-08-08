import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviewReports } from "@/db/schema";
import { getAuthenticatedDbUser } from "@/lib/authenticated-user";
import { getProviderReviewActionContext } from "@/lib/provider-review-auth";
import type { ProviderReviewReportCategory } from "@/lib/review-domain";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MIN_REASON_LENGTH = 10;
const MAX_REASON_LENGTH = 2_000;
const VALID_CATEGORIES = new Set<ProviderReviewReportCategory>([
  "inaccurate",
  "abusive",
  "private_info",
  "fraud",
  "other",
]);

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid review id" }, { status: 400 });
  }

  const user = await getAuthenticatedDbUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const context = await getProviderReviewActionContext(id, user);
  if (!context) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const payload = await req.json().catch(() => ({}));
  const category = stringValue(payload.category) as ProviderReviewReportCategory;
  const reason = stringValue(payload.reason);

  if (!VALID_CATEGORIES.has(category)) {
    return NextResponse.json({ error: "Choose a report category" }, { status: 400 });
  }
  if (reason.length < MIN_REASON_LENGTH) {
    return NextResponse.json(
      { error: `Report reason must be at least ${MIN_REASON_LENGTH} characters` },
      { status: 400 }
    );
  }
  if (reason.length > MAX_REASON_LENGTH) {
    return NextResponse.json(
      { error: `Report reason cannot exceed ${MAX_REASON_LENGTH} characters` },
      { status: 400 }
    );
  }

  const [existingReport] = await db
    .select({ id: reviewReports.id })
    .from(reviewReports)
    .where(
      and(
        eq(reviewReports.ratingId, context.ratingId),
        eq(reviewReports.reportedByUserId, user.id)
      )
    )
    .limit(1);

  if (existingReport) {
    return NextResponse.json(
      { error: "This review has already been reported" },
      { status: 409 }
    );
  }

  const [report] = await db
    .insert(reviewReports)
    .values({
      ratingId: context.ratingId,
      reportedByUserId: user.id,
      category,
      reason,
    })
    .returning({
      id: reviewReports.id,
      category: reviewReports.category,
      reason: reviewReports.reason,
      status: reviewReports.status,
      resolutionNote: reviewReports.resolutionNote,
      createdAt: reviewReports.createdAt,
      updatedAt: reviewReports.updatedAt,
    });

  revalidatePath("/dashboard/reviews");

  return NextResponse.json({
    report: {
      id: report.id,
      category: report.category,
      reason: report.reason,
      status: report.status,
      resolutionNote: report.resolutionNote ?? "",
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
    },
  });
}
