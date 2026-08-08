import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { withBookingTransaction } from "@/db/booking-db";
import {
  providerReviewResponseHistory,
  providerReviewResponses,
} from "@/db/schema";
import { getAuthenticatedDbUser } from "@/lib/authenticated-user";
import { createNotification } from "@/lib/notifications";
import { getProviderReviewActionContext } from "@/lib/provider-review-auth";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_RESPONSE_LENGTH = 2_000;

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function PUT(
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
  const body = stringValue(payload.body);

  if (!body) {
    return NextResponse.json(
      { error: "Write a response before publishing" },
      { status: 400 }
    );
  }
  if (body.length > MAX_RESPONSE_LENGTH) {
    return NextResponse.json(
      { error: `Response cannot exceed ${MAX_RESPONSE_LENGTH} characters` },
      { status: 400 }
    );
  }

  const mutation = await withBookingTransaction(async (tx) => {
    const [existingResponse] = await tx
      .select({
        id: providerReviewResponses.id,
        body: providerReviewResponses.body,
        createdAt: providerReviewResponses.createdAt,
      })
      .from(providerReviewResponses)
      .where(eq(providerReviewResponses.ratingId, context.ratingId))
      .limit(1)
      .for("update");

    const wasUpdate = Boolean(existingResponse);
    const [response] = existingResponse
      ? await tx
          .update(providerReviewResponses)
          .set({ body, updatedAt: new Date() })
          .where(eq(providerReviewResponses.id, existingResponse.id))
          .returning({
            id: providerReviewResponses.id,
            body: providerReviewResponses.body,
            createdAt: providerReviewResponses.createdAt,
            updatedAt: providerReviewResponses.updatedAt,
          })
      : await tx
          .insert(providerReviewResponses)
          .values({
            ratingId: context.ratingId,
            providerUserId: user.id,
            body,
          })
          .returning({
            id: providerReviewResponses.id,
            body: providerReviewResponses.body,
            createdAt: providerReviewResponses.createdAt,
            updatedAt: providerReviewResponses.updatedAt,
          });

    const [history] = await tx
      .insert(providerReviewResponseHistory)
      .values({
        responseId: response.id,
        changedByUserId: user.id,
        action: wasUpdate ? "updated" : "created",
        previousBody: existingResponse?.body ?? null,
        newBody: body,
      })
      .returning({
        id: providerReviewResponseHistory.id,
        action: providerReviewResponseHistory.action,
        previousBody: providerReviewResponseHistory.previousBody,
        newBody: providerReviewResponseHistory.newBody,
        createdAt: providerReviewResponseHistory.createdAt,
      });

    return { response, history, wasUpdate };
  });

  await createNotification({
    userId: context.clientUserId,
    type: "review",
    title: mutation.wasUpdate
      ? "Provider updated a review response"
      : "Provider responded to your review",
    body: mutation.wasUpdate
      ? `${context.serviceName} has an updated provider response.`
      : `${context.serviceName} has a provider response.`,
    href: `/dashboard/appointments?booking=${context.bookingId}`,
    eventKey: `review-response:${context.ratingId}:${mutation.history.id}`,
  });

  revalidatePath("/dashboard/reviews");
  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard/notifications");

  return NextResponse.json({
    response: {
      id: mutation.response.id,
      body: mutation.response.body,
      createdAt: mutation.response.createdAt.toISOString(),
      updatedAt: mutation.response.updatedAt.toISOString(),
      history: [
        {
          action: mutation.history.action === "updated" ? "updated" : "created",
          previousBody: mutation.history.previousBody ?? "",
          newBody: mutation.history.newBody,
          createdAt: mutation.history.createdAt.toISOString(),
        },
      ],
    },
  });
}
