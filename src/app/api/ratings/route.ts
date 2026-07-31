import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  applications,
  braiders,
  opportunities,
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

  const [review] = application
    ? await db
        .insert(ratings)
        .values(values)
        .onConflictDoUpdate({
          target: [ratings.applicationId, ratings.reviewerId],
          set: updateSet,
        })
        .returning({ score: ratings.score, comment: ratings.comment })
    : await db
        .insert(ratings)
        .values(values)
        .onConflictDoUpdate({
          target: [ratings.bookingId, ratings.reviewerId],
          set: updateSet,
        })
        .returning({ score: ratings.score, comment: ratings.comment });

  const recipientId: string | null | undefined = booking
    ? resolveBookingReviewTarget(user, booking)?.recipientId
    : target.braiderId
      ? application?.braiderUserId
      : application?.ownerId;
  if (recipientId) {
    await createNotification({
      userId: recipientId,
      type: "review",
      title: "New review",
      body: `You received a ${score}-star review.`,
      href: "/dashboard/settings",
      eventKey: application
        ? `review:${application.id}:${user.id}`
        : `booking-review:${booking!.id}:${user.id}`,
    });
  }

  revalidatePath("/");
  revalidatePath("/braiders", "layout");
  revalidatePath("/salons", "layout");
  revalidatePath("/dashboard", "layout");

  return NextResponse.json({
    review: { score: review.score, comment: review.comment ?? "" },
  });
}
