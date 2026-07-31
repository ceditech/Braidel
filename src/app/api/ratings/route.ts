import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { withBookingTransaction } from "@/db/booking-db";
import {
  applications,
  braiders,
  opportunities,
  ratingHistory,
  ratings,
  salons,
  users,
} from "@/db/schema";
import {
  getBookingParticipantContext,
  resolveBookingReviewTarget,
} from "@/lib/booking-participants";
import { createNotification } from "@/lib/notifications";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_COMMENT_LENGTH = 2_000;

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function getDbUser(clerkId: string) {
  const [user] = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  return user ?? null;
}

async function getApplicationContext(applicationId: string) {
  const [application] = await db
    .select({
      id: applications.id,
      status: applications.status,
      braiderId: braiders.id,
      braiderUserId: braiders.userId,
      salonId: salons.id,
      ownerId: salons.ownerId,
    })
    .from(applications)
    .innerJoin(opportunities, eq(applications.opportunityId, opportunities.id))
    .innerJoin(salons, eq(opportunities.salonId, salons.id))
    .innerJoin(braiders, eq(applications.braiderId, braiders.id))
    .where(eq(applications.id, applicationId))
    .limit(1);

  return application ?? null;
}

function resolveTarget(
  user: NonNullable<Awaited<ReturnType<typeof getDbUser>>>,
  application: NonNullable<Awaited<ReturnType<typeof getApplicationContext>>>
) {
  if (user.id === application.ownerId) {
    return { braiderId: application.braiderId, salonId: null };
  }
  if (user.id === application.braiderUserId) {
    return { braiderId: null, salonId: application.salonId };
  }

  if (process.env.NODE_ENV !== "production") {
    if (user.role === "salon_owner") {
      return { braiderId: application.braiderId, salonId: null };
    }
    if (user.role === "braider") {
      return { braiderId: null, salonId: application.salonId };
    }
  }

  return null;
}

export async function PUT(req: NextRequest) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json().catch(() => ({}));
  const applicationId = stringValue(payload.applicationId);
  const bookingId = stringValue(payload.bookingId);
  const comment = stringValue(payload.comment);
  const score = payload.score;
  const hasApplicationId = UUID_PATTERN.test(applicationId);
  const hasBookingId = UUID_PATTERN.test(bookingId);

  if (hasApplicationId === hasBookingId) {
    return NextResponse.json({ error: "Invalid review context" }, { status: 400 });
  }
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    return NextResponse.json({ error: "Choose a rating from 1 to 5" }, { status: 400 });
  }
  if (comment.length > MAX_COMMENT_LENGTH) {
    return NextResponse.json(
      { error: `Review cannot exceed ${MAX_COMMENT_LENGTH} characters` },
      { status: 400 }
    );
  }

  const [user, application, booking] = await Promise.all([
    getDbUser(clerkUser.id),
    hasApplicationId ? getApplicationContext(applicationId) : Promise.resolve(null),
    hasBookingId ? getBookingParticipantContext(bookingId) : Promise.resolve(null),
  ]);

  if (!user) {
    return NextResponse.json({ error: "User profile not found" }, { status: 404 });
  }
  if (hasApplicationId && !application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }
  if (hasBookingId && !booking) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }
  if (application && application.status !== "accepted") {
    return NextResponse.json(
      { error: "Reviews are available after an application is matched" },
      { status: 409 }
    );
  }
  if (booking && booking.status !== "completed") {
    return NextResponse.json(
      { error: "Reviews are available after an appointment is completed" },
      { status: 409 }
    );
  }

  const target = application
    ? resolveTarget(user, application)
    : booking
      ? resolveBookingReviewTarget(user, booking)
      : null;
  if (!target) {
    return NextResponse.json({ error: "You cannot review this experience" }, { status: 403 });
  }

  const values = {
    applicationId: application?.id ?? null,
    bookingId: booking?.id ?? null,
    reviewerId: user.id,
    braiderId: target.braiderId,
    salonId: target.salonId,
    score,
    comment: comment || null,
  };
  const updateSet = {
    braiderId: target.braiderId,
    salonId: target.salonId,
    score,
    comment: comment || null,
    updatedAt: new Date(),
  };

  const mutation = await withBookingTransaction(async (tx) => {
    const reviewCondition = application
      ? and(eq(ratings.applicationId, application.id), eq(ratings.reviewerId, user.id))
      : and(eq(ratings.bookingId, booking!.id), eq(ratings.reviewerId, user.id));
    const [existingReview] = await tx
      .select({
        id: ratings.id,
        score: ratings.score,
        comment: ratings.comment,
      })
      .from(ratings)
      .where(reviewCondition)
      .limit(1)
      .for("update");

    const [review] = existingReview
      ? await tx
          .update(ratings)
          .set(updateSet)
          .where(eq(ratings.id, existingReview.id))
          .returning({
            id: ratings.id,
            score: ratings.score,
            comment: ratings.comment,
          })
      : await tx
          .insert(ratings)
          .values(values)
          .returning({
            id: ratings.id,
            score: ratings.score,
            comment: ratings.comment,
          });

    const [history] = await tx
      .insert(ratingHistory)
      .values({
        ratingId: review.id,
        changedByUserId: user.id,
        action: existingReview ? "updated" : "created",
        previousScore: existingReview?.score ?? null,
        previousComment: existingReview?.comment ?? null,
        newScore: score,
        newComment: comment || null,
      })
      .returning({
        id: ratingHistory.id,
        action: ratingHistory.action,
      });

    return {
      review,
      history,
      wasUpdate: Boolean(existingReview),
    };
  });

  const recipientId: string | null | undefined = booking
    ? resolveBookingReviewTarget(user, booking)?.recipientId
    : target.braiderId
      ? application?.braiderUserId
      : application?.ownerId;
  if (recipientId) {
    const reviewHref = booking
      ? `/dashboard/appointments?booking=${booking.id}`
      : "/dashboard/settings";
    await createNotification({
      userId: recipientId,
      type: "review",
      title: mutation.wasUpdate ? "Review updated" : "New review",
      body: mutation.wasUpdate
        ? `A review was updated to ${score} stars.`
        : `You received a ${score}-star review.`,
      href: reviewHref,
      eventKey: mutation.wasUpdate
        ? application
          ? `review-updated:${application.id}:${user.id}:${mutation.history.id}`
          : `booking-review-updated:${booking!.id}:${user.id}:${mutation.history.id}`
        : application
          ? `review:${application.id}:${user.id}`
          : `booking-review:${booking!.id}:${user.id}`,
    });
  }

  revalidatePath("/");
  revalidatePath("/braiders", "layout");
  revalidatePath("/salons", "layout");
  revalidatePath("/dashboard", "layout");

  return NextResponse.json({
    review: { score: mutation.review.score, comment: mutation.review.comment ?? "" },
  });
}
