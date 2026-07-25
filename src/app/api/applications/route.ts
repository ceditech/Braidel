import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { applications, braiders, opportunities, salons, users } from "@/db/schema";
import { createNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const opportunitySlug = typeof body.opportunitySlug === "string" ? body.opportunitySlug : "";
  if (!opportunitySlug) {
    return NextResponse.json({ error: "Opportunity is required" }, { status: 400 });
  }

  const [user] = await db
    .select({
      id: users.id,
      role: users.role,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (!user || user.role !== "braider") {
    return NextResponse.json({ error: "Only braiders can apply to opportunities" }, { status: 403 });
  }

  const [braider] = await db
    .select({ id: braiders.id })
    .from(braiders)
    .where(eq(braiders.userId, user.id))
    .limit(1);

  if (!braider) {
    return NextResponse.json({ error: "Braider profile not found" }, { status: 404 });
  }

  const [opportunity] = await db
    .select({
      id: opportunities.id,
      isActive: opportunities.isActive,
      title: opportunities.title,
      ownerId: salons.ownerId,
    })
    .from(opportunities)
    .innerJoin(salons, eq(opportunities.salonId, salons.id))
    .where(eq(opportunities.slug, opportunitySlug))
    .limit(1);

  if (!opportunity || !opportunity.isActive) {
    return NextResponse.json({ error: "Opportunity is not available" }, { status: 404 });
  }

  const existing = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.opportunityId, opportunity.id), eq(applications.braiderId, braider.id)))
    .limit(1);

  if (existing.length) {
    return NextResponse.json({ error: "You already applied to this opportunity" }, { status: 409 });
  }

  const coverNote = typeof body.coverNote === "string" ? body.coverNote.trim() || null : null;
  const [application] = await db
    .insert(applications)
    .values({
      opportunityId: opportunity.id,
      braiderId: braider.id,
      coverNote,
    })
    .returning({ id: applications.id });

  const applicantName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "A braider";
  await createNotification({
    userId: opportunity.ownerId,
    type: "application",
    title: "New application",
    body: `${applicantName} applied for ${opportunity.title}.`,
    href: "/dashboard/applicants",
    eventKey: `application:${application.id}`,
  });

  return NextResponse.json({ ok: true });
}
