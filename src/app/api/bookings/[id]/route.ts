import { NextResponse } from "next/server";
import {
  bookingApiError,
  integerValue,
  readJsonObject,
  requireBookingApiUser,
  stringValue,
} from "@/lib/booking-api";
import type { BookingAction } from "@/lib/booking-domain";
import {
  BookingServiceError,
  mutateBooking,
} from "@/lib/booking-service";

export const runtime = "nodejs";

const ACTIONS = new Set<BookingAction>([
  "confirm",
  "decline",
  "cancel",
  "complete",
  "no_show",
  "reschedule",
]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireBookingApiUser();
    const body = await readJsonObject(request);
    const action = stringValue(body.action) as BookingAction;
    if (!ACTIONS.has(action)) {
      throw new BookingServiceError("Appointment action is invalid.");
    }
    const version = integerValue(body.version, -1);
    if (version < 1) {
      throw new BookingServiceError("Appointment version is required.");
    }
    const { id } = await params;
    const booking = await mutateBooking(user, id, {
      action,
      version,
      reason: stringValue(body.reason),
      startsAt: stringValue(body.startsAt) || undefined,
    });
    return NextResponse.json({ booking });
  } catch (error) {
    return bookingApiError(error);
  }
}

