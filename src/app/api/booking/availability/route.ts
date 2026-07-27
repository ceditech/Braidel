import { Temporal } from "@js-temporal/polyfill";
import { NextResponse } from "next/server";
import {
  getAvailabilityData,
  getClientProfileForUser,
} from "@/db/booking-queries";
import {
  bookingApiError,
  integerValue,
  requireBookingApiUser,
} from "@/lib/booking-api";
import { getAvailabilitySlots } from "@/lib/booking-availability";
import { BookingServiceError } from "@/lib/booking-service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const user = await requireBookingApiUser();
    const url = new URL(request.url);
    const providerId = url.searchParams.get("providerId")?.trim() ?? "";
    const serviceId = url.searchParams.get("serviceId")?.trim() ?? "";
    const startDate =
      url.searchParams.get("startDate")?.trim() ??
      Temporal.Now.plainDateISO().toString();
    const days = integerValue(url.searchParams.get("days"), 1);
    if (!providerId || !serviceId) {
      throw new BookingServiceError("Provider and service are required.");
    }
    if (days < 1 || days > 31) {
      throw new BookingServiceError(
        "Availability can be requested for 1 to 31 days."
      );
    }
    try {
      Temporal.PlainDate.from(startDate);
    } catch {
      throw new BookingServiceError("Start date is invalid.");
    }

    const clientProfile =
      user.role === "client" ? await getClientProfileForUser(user.id) : null;
    const data = await getAvailabilityData(
      providerId,
      serviceId,
      clientProfile?.id
    );
    if (!data || !data.service.isActive) {
      throw new BookingServiceError("Service is not available.", 404);
    }
    if (
      user.role === "client" &&
      !data.provider.isAcceptingBookings
    ) {
      throw new BookingServiceError(
        "This provider is not currently accepting bookings.",
        409,
        "PROVIDER_UNAVAILABLE"
      );
    }

    const slots = getAvailabilitySlots({
      timezone: data.provider.timezone,
      durationMinutes: data.service.durationMinutes,
      maxConcurrentBookings: data.provider.maxConcurrentBookings,
      startDate,
      days,
      rules: data.rules,
      exceptions: data.exceptions,
      providerBookings: data.providerBookings,
      clientBookings: data.clientBookings,
    });

    return NextResponse.json({
      provider: data.provider,
      service: data.service,
      slots,
    });
  } catch (error) {
    return bookingApiError(error);
  }
}

