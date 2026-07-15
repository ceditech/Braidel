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
  const comment = stringValue(payload.comment);
  const score = payload.score;

  if (!UUID_PATTERN.test(applicationId)) {
    return NextResponse.json({ error: "Invalid application" }, { status: 400 });
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

  const [user, application] = await Promise.all([
    getDbUser(clerkUser.id),
    getApplicationContext(applicationId),
  ]);

  if (!user) {
    return NextResponse.json({ error: "User profile not found" }, { status: 404 });
  }
  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }
  if (application.status !== "accepted") {
    return NextResponse.json(
      { error: "Reviews are available after an application is matched" },
      { status: 409 }
    );
  }

  const target = resolveTarget(user, application);
  if (!target) {
    return NextResponse.json({ error: "You cannot review this match" }, { status: 403 });
  }

  const [review] = await db
    .insert(ratings)
    .values({
      applicationId: application.id,
      reviewerId: user.id,
      braiderId: target.braiderId,
      salonId: target.salonId,
      score,
      comment: comment || null,
    })
    .onConflictDoUpdate({
      target: [ratings.applicationId, ratings.reviewerId],
      set: {
        braiderId: target.braiderId,
        salonId: target.salonId,
        score,
        comment: comment || null,
        updatedAt: new Date(),
      },
    })
    .returning({ score: ratings.score, comment: ratings.comment });

  revalidatePath("/");
  revalidatePath("/braiders", "layout");
  revalidatePath("/salons", "layout");
  revalidatePath("/dashboard", "layout");

  return NextResponse.json({
    review: { score: review.score, comment: review.comment ?? "" },
  });
}
