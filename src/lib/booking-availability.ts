import "server-only";

import { Temporal } from "@js-temporal/polyfill";
import type {
  AvailabilityExceptionDTO,
  AvailabilityRuleDTO,
  AvailabilitySlotDTO,
} from "@/lib/booking-domain";

const SLOT_INTERVAL_MINUTES = 30;
const MINIMUM_LEAD_MINUTES = 120;

interface BusyRange {
  startsAt: string;
  endsAt: string;
}

interface AvailabilityInput {
  timezone: string;
  durationMinutes: number;
  maxConcurrentBookings: number;
  startDate: string;
  days: number;
  rules: AvailabilityRuleDTO[];
  exceptions: AvailabilityExceptionDTO[];
  providerBookings: BusyRange[];
  clientBookings?: BusyRange[];
  now?: Temporal.Instant;
}

export function isValidTimezone(value: string) {
  try {
    Temporal.Now.zonedDateTimeISO(value);
    return true;
  } catch {
    return false;
  }
}

export function localDateTimeToInstant(
  date: string,
  time: string,
  timezone: string
) {
  const plainDate = Temporal.PlainDate.from(date);
  const plainTime = Temporal.PlainTime.from(normalizeTime(time));
  return plainDate
    .toPlainDateTime(plainTime)
    .toZonedDateTime(timezone, { disambiguation: "compatible" })
    .toInstant();
}

export function getAvailabilitySlots({
  timezone,
  durationMinutes,
  maxConcurrentBookings,
  startDate,
  days,
  rules,
  exceptions,
  providerBookings,
  clientBookings = [],
  now = Temporal.Now.instant(),
}: AvailabilityInput): AvailabilitySlotDTO[] {
  const slots: AvailabilitySlotDTO[] = [];
  const firstDate = Temporal.PlainDate.from(startDate);
  const minimumStart = now.add({ minutes: MINIMUM_LEAD_MINUTES });

  for (let offset = 0; offset < days; offset += 1) {
    const date = firstDate.add({ days: offset });
    const dateString = date.toString();
    const dayOfWeek = date.dayOfWeek % 7;
    const dayRules = rules.filter(
      (rule) =>
        rule.isActive &&
        rule.dayOfWeek === dayOfWeek &&
        (!rule.effectiveFrom || rule.effectiveFrom <= dateString) &&
        (!rule.effectiveUntil || rule.effectiveUntil >= dateString)
    );

    const windows = dayRules.map((rule) => ({
      start: localDateTimeToInstant(dateString, rule.startTime, timezone),
      end: localDateTimeToInstant(dateString, rule.endTime, timezone),
    }));

    for (const exception of exceptions) {
      if (exception.overrideType !== "available") continue;
      const start = Temporal.Instant.from(exception.startsAt);
      const end = Temporal.Instant.from(exception.endsAt);
      const localStart = start.toZonedDateTimeISO(timezone).toPlainDate();
      if (Temporal.PlainDate.compare(localStart, date) === 0) {
        windows.push({ start, end });
      }
    }

    for (const window of windows) {
      let cursor = window.start;
      while (
        Temporal.Instant.compare(
          cursor.add({ minutes: durationMinutes }),
          window.end
        ) <= 0
      ) {
        const slotEnd = cursor.add({ minutes: durationMinutes });
        const providerOverlapCount = countOverlaps(
          providerBookings,
          cursor,
          slotEnd
        );
        const clientHasConflict =
          countOverlaps(clientBookings, cursor, slotEnd) > 0;
        const blockedByException = exceptions.some(
          (exception) =>
            exception.overrideType === "unavailable" &&
            overlaps(
              Temporal.Instant.from(exception.startsAt),
              Temporal.Instant.from(exception.endsAt),
              cursor,
              slotEnd
            )
        );

        if (
          Temporal.Instant.compare(cursor, minimumStart) >= 0 &&
          providerOverlapCount < maxConcurrentBookings &&
          !clientHasConflict &&
          !blockedByException
        ) {
          const local = cursor.toZonedDateTimeISO(timezone);
          const localTime = `${String(local.hour).padStart(2, "0")}:${String(
            local.minute
          ).padStart(2, "0")}`;
          const key = cursor.toString();
          if (!slots.some((slot) => slot.startsAt === key)) {
            slots.push({
              startsAt: key,
              endsAt: slotEnd.toString(),
              localDate: dateString,
              localTime,
            });
          }
        }

        cursor = cursor.add({ minutes: SLOT_INTERVAL_MINUTES });
      }
    }
  }

  return slots.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export function slotIsAvailable(
  input: Omit<AvailabilityInput, "startDate" | "days"> & {
    startsAt: string;
  }
) {
  const start = Temporal.Instant.from(input.startsAt);
  const localDate = start
    .toZonedDateTimeISO(input.timezone)
    .toPlainDate()
    .toString();
  return getAvailabilitySlots({
    ...input,
    startDate: localDate,
    days: 1,
  }).some((slot) => slot.startsAt === start.toString());
}

function normalizeTime(value: string) {
  const [hour = "00", minute = "00", second = "00"] = value.split(":");
  return `${hour}:${minute}:${second}`;
}

function countOverlaps(
  ranges: BusyRange[],
  startsAt: Temporal.Instant,
  endsAt: Temporal.Instant
) {
  return ranges.filter((range) =>
    overlaps(
      Temporal.Instant.from(range.startsAt),
      Temporal.Instant.from(range.endsAt),
      startsAt,
      endsAt
    )
  ).length;
}

function overlaps(
  existingStart: Temporal.Instant,
  existingEnd: Temporal.Instant,
  candidateStart: Temporal.Instant,
  candidateEnd: Temporal.Instant
) {
  return (
    Temporal.Instant.compare(existingStart, candidateEnd) < 0 &&
    Temporal.Instant.compare(existingEnd, candidateStart) > 0
  );
}

