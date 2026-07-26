import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { braiders, notificationPreferences, salons, users } from "@/db/schema";

type SettingsRole = "salon" | "braider" | "client";

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(value.map((item) => stringValue(item)).filter(Boolean))
  );
}

function splitFullName(fullName: string) {
  const [first, ...rest] = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: first || "Braider",
    lastName: rest.join(" ") || "-",
  };
}

function parseYears(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.round(value));
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : null;
}

async function saveNotificationPreferences(userId: string, value: unknown) {
  if (!value || typeof value !== "object") return;
  const preferences = value as Record<string, unknown>;
  const next = {
    activity: preferences.activity !== false,
    messages: preferences.messages !== false,
    weeklyDigest: preferences.weeklyDigest === true,
    updatedAt: new Date(),
  };

  await db
    .insert(notificationPreferences)
    .values({ userId, ...next })
    .onConflictDoUpdate({
      target: notificationPreferences.userId,
      set: next,
    });
}

export async function PATCH(req: NextRequest) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const role =
    body.role === "salon" || body.role === "braider" || body.role === "client"
      ? (body.role as SettingsRole)
      : null;
  if (!role) {
    return NextResponse.json({ error: "Invalid settings role" }, { status: 400 });
  }

  const [user] = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (!user) {
    return NextResponse.json({ error: "User profile not found" }, { status: 404 });
  }

  if (role === "client") {
    if (user.role !== "client") {
      return NextResponse.json(
        { error: "Only client accounts can update client settings" },
        { status: 403 }
      );
    }

    const firstName = stringValue(body.firstName);
    const lastName = stringValue(body.lastName);
    if (!firstName) {
      return NextResponse.json({ error: "First name is required" }, { status: 400 });
    }

    await db
      .update(users)
      .set({
        firstName,
        lastName,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    await saveNotificationPreferences(user.id, body.notifications);
    return NextResponse.json({ ok: true });
  }

  if (role === "salon") {
    if (user.role !== "salon_owner") {
      return NextResponse.json({ error: "Only salon owners can update salon settings" }, { status: 403 });
    }

    const [salon] = await db
      .select({ id: salons.id })
      .from(salons)
      .where(eq(salons.ownerId, user.id))
      .limit(1);

    if (!salon) {
      return NextResponse.json({ error: "Salon profile not found" }, { status: 404 });
    }

    const name = stringValue(body.name);
    if (!name) {
      return NextResponse.json({ error: "Salon name is required" }, { status: 400 });
    }

    await db
      .update(salons)
      .set({
        name,
        city: stringValue(body.city) || null,
        bio: stringValue(body.bio) || null,
        services: stringList(body.services),
        phone: stringValue(body.phone) || null,
        website: stringValue(body.website) || null,
        updatedAt: new Date(),
      })
      .where(eq(salons.id, salon.id));

    await saveNotificationPreferences(user.id, body.notifications);

    return NextResponse.json({ ok: true });
  }

  if (user.role !== "braider") {
    return NextResponse.json({ error: "Only braiders can update braider settings" }, { status: 403 });
  }

  const [braider] = await db
    .select({ id: braiders.id })
    .from(braiders)
    .where(eq(braiders.userId, user.id))
    .limit(1);

  if (!braider) {
    return NextResponse.json({ error: "Braider profile not found" }, { status: 404 });
  }

  const fullName = stringValue(body.fullName);
  if (!fullName) {
    return NextResponse.json({ error: "Full name is required" }, { status: 400 });
  }

  const { firstName, lastName } = splitFullName(fullName);
  await db.update(users).set({ firstName, lastName, updatedAt: new Date() }).where(eq(users.id, user.id));
  await db
    .update(braiders)
    .set({
      city: stringValue(body.city) || null,
      bio: stringValue(body.bio) || null,
      specialties: stringList(body.specialties),
      priceRange: stringValue(body.priceRange) || null,
      yearsExperience: parseYears(body.yearsExperience),
      isAvailable: Boolean(body.isAvailable),
      updatedAt: new Date(),
    })
    .where(eq(braiders.id, braider.id));

  await saveNotificationPreferences(user.id, body.notifications);

  return NextResponse.json({ ok: true });
}
