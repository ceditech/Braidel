import "server-only";

import { NextResponse } from "next/server";
import {
  getAuthenticatedDbUser,
  type AuthenticatedDbUser,
} from "@/lib/authenticated-user";
import { BookingServiceError } from "@/lib/booking-service";

export async function requireBookingApiUser(): Promise<AuthenticatedDbUser> {
  const user = await getAuthenticatedDbUser();
  if (!user) {
    throw new BookingServiceError("Unauthorized", 401, "UNAUTHORIZED");
  }
  if (!user.onboardedAt) {
    throw new BookingServiceError(
      "Complete onboarding before using appointments.",
      403,
      "ONBOARDING_REQUIRED"
    );
  }
  return user;
}

export async function readJsonObject(request: Request) {
  const value = await request.json().catch(() => null);
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new BookingServiceError("A valid JSON body is required.");
  }
  return value as Record<string, unknown>;
}

export function bookingApiError(error: unknown) {
  if (error instanceof BookingServiceError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.status }
    );
  }
  console.error("Booking API error", error);
  return NextResponse.json(
    { error: "The booking request could not be completed.", code: "INTERNAL_ERROR" },
    { status: 500 }
  );
}

export function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function integerValue(value: unknown, fallback = 0) {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;
  return Number.isFinite(parsed) ? Math.round(parsed) : fallback;
}

export function booleanValue(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

