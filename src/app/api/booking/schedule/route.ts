import { NextResponse } from "next/server";
import {
  booleanValue,
  bookingApiError,
  integerValue,
  readJsonObject,
  requireBookingApiUser,
  stringValue,
} from "@/lib/booking-api";
import {
  replaceAvailabilityRules,
  type AvailabilityRuleInput,
} from "@/lib/booking-service";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  try {
    const user = await requireBookingApiUser();
    const body = await readJsonObject(request);
    const rawRules = Array.isArray(body.rules) ? body.rules : [];
    const rules: AvailabilityRuleInput[] = rawRules
      .filter(
        (value): value is Record<string, unknown> =>
          Boolean(value) && typeof value === "object" && !Array.isArray(value)
      )
      .map((rule) => ({
        dayOfWeek: integerValue(rule.dayOfWeek, -1),
        startTime: stringValue(rule.startTime),
        endTime: stringValue(rule.endTime),
        isActive: booleanValue(rule.isActive),
      }));
    const provider = await replaceAvailabilityRules(user, rules);
    return NextResponse.json({ provider });
  } catch (error) {
    return bookingApiError(error);
  }
}

