import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import { syncClerkUser, tombstoneClerkUser } from "@/lib/clerk-sync";

function webhookTimestamp(request: NextRequest): Date {
  const rawTimestamp = request.headers.get("svix-timestamp");
  if (!rawTimestamp) return new Date();

  const seconds = Number(rawTimestamp);
  const timestamp = new Date(seconds * 1000);
  return Number.isFinite(seconds) && !Number.isNaN(timestamp.getTime())
    ? timestamp
    : new Date();
}

export async function POST(request: NextRequest) {
  if (!process.env.CLERK_WEBHOOK_SIGNING_SECRET) {
    console.error("CLERK_WEBHOOK_SIGNING_SECRET is not configured");
    return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });
  }

  let event;
  try {
    event = await verifyWebhook(request);
  } catch (error) {
    console.error("Clerk webhook verification failed", error);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  try {
    if (event.type === "user.created" || event.type === "user.updated") {
      const result = await syncClerkUser(event.data);
      return NextResponse.json({ received: true, status: result.status });
    }

    if (event.type === "user.deleted") {
      if (!event.data.id) {
        return NextResponse.json({ received: true, status: "missing" });
      }
      const result = await tombstoneClerkUser(event.data.id, webhookTimestamp(request));
      return NextResponse.json({ received: true, status: result.status });
    }

    return NextResponse.json({ received: true, status: "ignored" });
  } catch (error) {
    console.error(`Clerk webhook processing failed for ${event.type}`, error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
