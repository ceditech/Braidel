import { currentUser } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { braidStyles, opportunities, salons, users } from "@/db/schema";

type OpportunityType = "full_time" | "part_time" | "booth_rental" | "commission" | "freelance";
type CustomStyleInput = { name: string; slug: string; description: string };

function slugify(value: string) {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "opportunity"}-${Date.now().toString(36)}`;
}

function styleSlug(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "custom-style"
  );
}

function parseType(value: unknown): OpportunityType {
  const map: Record<string, OpportunityType> = {
    "Full-time": "full_time",
    "Part-time": "part_time",
    Contract: "freelance",
    "Single event": "freelance",
    "Booth rental": "booth_rental",
    Commission: "commission",
  };
  return typeof value === "string" ? map[value] ?? "freelance" : "freelance";
}

function splitLocation(value: unknown) {
  if (typeof value !== "string") return { city: null, state: null };
  const [city, state] = value.split(",").map((part) => part.trim());
  return { city: city || null, state: state || null };
}

export async function POST(req: NextRequest) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (!user || user.role !== "salon_owner") {
    return NextResponse.json({ error: "Only salon owners can post opportunities" }, { status: 403 });
  }

  const [salon] = await db
    .select({ id: salons.id })
    .from(salons)
    .where(eq(salons.ownerId, user.id))
    .limit(1);

  if (!salon) {
    return NextResponse.json({ error: "Salon profile not found" }, { status: 404 });
  }

  const body = await req.json();
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  if (!title || !description) {
    return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
  }

  const location = splitLocation(body.location);
  const isActive = body.status !== "draft";
  const customStyles: CustomStyleInput[] = Array.isArray(body.customStyles)
    ? (body.customStyles as unknown[])
        .map((style: unknown) => {
          if (!style || typeof style !== "object") return null;
          const candidate = style as { name?: unknown; description?: unknown };
          const name = typeof candidate.name === "string" ? candidate.name.trim() : "";
          if (!name) return null;
          return {
            name,
            slug: styleSlug(name),
            description:
              typeof candidate.description === "string" && candidate.description.trim()
                ? candidate.description.trim()
                : "Custom specialty added by the opportunity poster.",
          };
        })
        .filter((style): style is CustomStyleInput => Boolean(style))
    : [];

  for (const style of customStyles) {
    await db
      .insert(braidStyles)
      .values({
        name: style.name,
        slug: style.slug,
        description: style.description,
        imagePath: null,
        imagePrompt: null,
        isCustom: true,
        createdById: user.id,
      })
      .onConflictDoNothing({ target: braidStyles.slug });
  }

  const requestedSpecialties = Array.isArray(body.specialties)
    ? body.specialties.filter((s: unknown): s is string => typeof s === "string" && Boolean(s.trim()))
    : [];
  const specialties = Array.from(new Set([...requestedSpecialties, ...customStyles.map((style) => style.name)]));

  const [opportunity] = await db
    .insert(opportunities)
    .values({
      salonId: salon.id,
      slug: slugify(title),
      title,
      description,
      type: parseType(body.type),
      city: location.city,
      state: location.state,
      compensation: typeof body.compensation === "string" ? body.compensation.trim() || null : null,
      specialties,
      isActive,
    })
    .returning({ slug: opportunities.slug });

  if (isActive) {
    await db.update(salons).set({ openRoles: sql`${salons.openRoles} + 1` }).where(eq(salons.id, salon.id));
  }

  return NextResponse.json({ ok: true, slug: opportunity.slug });
}
