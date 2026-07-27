import { NextResponse } from "next/server";
import { getProviderWorkspaceForUser } from "@/db/booking-queries";
import {
  bookingApiError,
  readJsonObject,
  requireBookingApiUser,
  stringValue,
} from "@/lib/booking-api";
import {
  BookingServiceError,
  createAvailabilityException,
} from "@/lib/booking-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireBookingApiUser();
    const body = await readJsonObject(request);
    const overrideType = stringValue(body.overrideType);
    if (overrideType !== "available" && overrideType !== "unavailable") {
      throw new BookingServiceError("Schedule exception type is invalid.");
    }
    await createAvailabilityException(user, {
      overrideType,
      localDate: stringValue(body.localDate),
      startTime: stringValue(body.startTime),
      endTime: stringValue(body.endTime),
      reason: stringValue(body.reason),
    });
    return NextResponse.json(
      { provider: await getProviderWorkspaceForUser(user) },
      { status: 201 }
    );
  } catch (error) {
    return bookingApiError(error);
  }
}

