import { currentUser } from "@clerk/nextjs/server";
import { and, count, eq, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notifications, users } from "@/db/schema";
import { backfillDueReviewReminders } from "@/lib/review-reminders";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function getUser(clerkId: string) {
  const [user] = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);
  return user ?? null;
}

async function unreadCount(userId: string) {
  const [row] = await db
    .select({ total: count(notifications.id) })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
  return row?.total ?? 0;
}

export async function GET() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUser(clerkUser.id);
  if (!user) return NextResponse.json({ unreadCount: 0 });

  if (user.role === "client") {
    // Opportunistic — no cron in this app yet. Failure here must never break
    // the notification bell, so it's isolated and logged, not rethrown.
    try {
      await backfillDueReviewReminders(user.id);
    } catch (error) {
      console.error("backfillDueReviewReminders failed", error);
    }
  }

  return NextResponse.json({ unreadCount: await unreadCount(user.id) });
}

export async function PATCH(req: NextRequest) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUser(clerkUser.id);
  if (!user) {
    return NextResponse.json({ error: "User profile not found" }, { status: 404 });
  }

  const payload = await req.json().catch(() => ({}));
  const id = typeof payload.id === "string" ? payload.id : "";
  const markAll = payload.all === true;
  if (!markAll && !UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid notification" }, { status: 400 });
  }

  const readAt = new Date();
  await db
    .update(notifications)
    .set({ readAt })
    .where(
      markAll
        ? and(eq(notifications.userId, user.id), isNull(notifications.readAt))
        : and(eq(notifications.id, id), eq(notifications.userId, user.id))
    );

  return NextResponse.json({ ok: true, unreadCount: await unreadCount(user.id) });
}
