import { NextResponse } from "next/server";
import { getProviderWorkspaceForUser } from "@/db/booking-queries";
import {
  booleanValue,
  bookingApiError,
  integerValue,
  readJsonObject,
  requireBookingApiUser,
  stringValue,
} from "@/lib/booking-api";
import { createServiceOffering } from "@/lib/booking-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireBookingApiUser();
    const body = await readJsonObject(request);
    await createServiceOffering(user, {
      name: stringValue(body.name),
      description: stringValue(body.description),
      durationMinutes: integerValue(body.durationMinutes),
      priceCents: integerValue(body.priceCents),
      currency: stringValue(body.currency).toUpperCase() || "USD",
      braidStyleId: stringValue(body.braidStyleId) || null,
      isActive: booleanValue(body.isActive, true),
    });
    return NextResponse.json(
      { provider: await getProviderWorkspaceForUser(user) },
      { status: 201 }
    );
  } catch (error) {
    return bookingApiError(error);
  }
}

