import { currentUser } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { applications, braiders, messages, opportunities, salons, users } from "@/db/schema";
import { createNotification } from "@/lib/notifications";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_MESSAGE_LENGTH = 4_000;

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function getApplicationParticipants(applicationId: string) {
  const [application] = await db
    .select({
      id: applications.id,
      ownerId: salons.ownerId,
      braiderUserId: braiders.userId,
    })
    .from(applications)
    .innerJoin(opportunities, eq(applications.opportunityId, opportunities.id))
    .innerJoin(salons, eq(opportunities.salonId, salons.id))
    .innerJoin(braiders, eq(applications.braiderId, braiders.id))
    .where(eq(applications.id, applicationId))
    .limit(1);

  return application ?? null;
}

async function getDbUser(clerkId: string) {
  const [user] = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  return user ?? null;
}

function resolveRecipient(
  user: NonNullable<Awaited<ReturnType<typeof getDbUser>>>,
  application: NonNullable<Awaited<ReturnType<typeof getApplicationParticipants>>>
): string | null {
  if (user.id === application.ownerId) return application.braiderUserId;
  if (user.id === application.braiderUserId) return application.ownerId;

  if (process.env.NODE_ENV !== "production") {
    if (user.role === "salon_owner") return application.braiderUserId;
    if (user.role === "braider") return application.ownerId;
  }

  return null;
}

export async function POST(req: NextRequest) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json().catch(() => ({}));
  const applicationId = stringValue(payload.applicationId);
  const body = stringValue(payload.body);

  if (!UUID_PATTERN.test(applicationId)) {
    return NextResponse.json({ error: "Invalid conversation" }, { status: 400 });
  }
  if (!body) {
    return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
  }
  if (body.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters` },
      { status: 400 }
    );
  }

  const [user, application] = await Promise.all([
    getDbUser(clerkUser.id),
    getApplicationParticipants(applicationId),
  ]);

  if (!user) {
    return NextResponse.json({ error: "User profile not found" }, { status: 404 });
  }
  if (!application) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const recipientId = resolveRecipient(user, application);
  if (!recipientId) {
    return NextResponse.json({ error: "You cannot access this conversation" }, { status: 403 });
  }

  const [message] = await db
    .insert(messages)
    .values({
      applicationId: application.id,
      senderId: user.id,
      recipientId,
      body,
    })
    .returning({
      id: messages.id,
      body: messages.body,
      createdAt: messages.createdAt,
    });

  await createNotification({
    userId: recipientId,
    type: "message",
    title: "New message",
    body: "You received a new message about an application.",
    href: `/dashboard/messages?application=${application.id}`,
    eventKey: `message:${message.id}`,
  });

  return NextResponse.json({
    message: {
      id: message.id,
      body: message.body,
      isMine: true,
      readAt: null,
      createdAt: message.createdAt.toISOString(),
    },
  });
}

export async function PATCH(req: NextRequest) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json().catch(() => ({}));
  const applicationId = stringValue(payload.applicationId);
  if (!UUID_PATTERN.test(applicationId)) {
    return NextResponse.json({ error: "Invalid conversation" }, { status: 400 });
  }

  const [user, application] = await Promise.all([
    getDbUser(clerkUser.id),
    getApplicationParticipants(applicationId),
  ]);

  if (!user) {
    return NextResponse.json({ error: "User profile not found" }, { status: 404 });
  }
  if (!application) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }
  if (!resolveRecipient(user, application)) {
    return NextResponse.json({ error: "You cannot access this conversation" }, { status: 403 });
  }

  const readAt = new Date();
  await db
    .update(messages)
    .set({ readAt })
    .where(
      and(
        eq(messages.applicationId, application.id),
        eq(messages.recipientId, user.id),
        isNull(messages.readAt)
      )
    );

  return NextResponse.json({ ok: true, readAt: readAt.toISOString() });
}
