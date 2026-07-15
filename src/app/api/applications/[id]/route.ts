import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { applications, opportunities, salons, users } from "@/db/schema";

type ApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected";

const STATUS_MAP: Record<string, ApplicationStatus> = {
  new: "pending",
  pending: "pending",
  shortlisted: "reviewed",
  reviewed: "reviewed",
  matched: "accepted",
  accepted: "accepted",
  declined: "rejected",
  rejected: "rejected",
};

function parseStatus(value: unknown): ApplicationStatus | null {
  if (typeof value !== "string") return null;
  return STATUS_MAP[value.trim().toLowerCase()] ?? null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const nextStatus = parseStatus(body.status);
  if (!nextStatus) {
    return NextResponse.json({ error: "Invalid application status" }, { status: 400 });
  }

  const [user] = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (!user || user.role !== "salon_owner") {
    return NextResponse.json({ error: "Only salon owners can update applicants" }, { status: 403 });
  }

  const [application] = await db
    .select({ id: applications.id, ownerId: salons.ownerId })
    .from(applications)
    .innerJoin(opportunities, eq(applications.opportunityId, opportunities.id))
    .innerJoin(salons, eq(opportunities.salonId, salons.id))
    .where(eq(applications.id, id))
    .limit(1);

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const allowDemoMutation = process.env.NODE_ENV !== "production";
  if (application.ownerId !== user.id && !allowDemoMutation) {
    return NextResponse.json({ error: "You can only update applicants for your salon" }, { status: 403 });
  }

  await db
    .update(applications)
    .set({ status: nextStatus, updatedAt: new Date() })
    .where(eq(applications.id, application.id));

  return NextResponse.json({ ok: true, status: nextStatus });
}
