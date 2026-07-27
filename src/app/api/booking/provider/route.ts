import { NextResponse } from "next/server";
import {
  booleanValue,
  bookingApiError,
  integerValue,
  readJsonObject,
  requireBookingApiUser,
  stringValue,
} from "@/lib/booking-api";
import { updateProviderSettings } from "@/lib/booking-service";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  try {
    const user = await requireBookingApiUser();
    const body = await readJsonObject(request);
    const provider = await updateProviderSettings(user, {
      timezone: stringValue(body.timezone),
      isAcceptingBookings: booleanValue(body.isAcceptingBookings),
      maxConcurrentBookings: integerValue(body.maxConcurrentBookings, 1),
    });
    return NextResponse.json({ provider });
  } catch (error) {
    return bookingApiError(error);
  }
}

