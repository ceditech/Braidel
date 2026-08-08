import { NextResponse } from "next/server";
import {
  bookingApiError,
  readJsonObject,
  requireBookingApiUser,
  stringValue,
} from "@/lib/booking-api";
import { createBookingRequest } from "@/lib/booking-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireBookingApiUser();
    const body = await readJsonObject(request);
    const booking = await createBookingRequest(user, {
      providerId: stringValue(body.providerId),
      serviceOfferingId: stringValue(body.serviceOfferingId),
      startsAt: stringValue(body.startsAt),
      clientNote: stringValue(body.clientNote),
      requestKey: stringValue(body.requestKey),
    });
    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    return bookingApiError(error);
  }
}

