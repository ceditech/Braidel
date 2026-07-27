import "server-only";

import { Temporal } from "@js-temporal/polyfill";
import {
  and,
  eq,
  gt,
  inArray,
  lt,
  ne,
  sql,
} from "drizzle-orm";
import {
  isRetryableBookingTransactionError,
  type TransactionDatabase,
  withBookingTransaction,
} from "@/db/booking-db";
import {
  getBookingById,
  getClientProfileForUser,
  getProviderForUser,
  getProviderWorkspaceForUser,
} from "@/db/booking-queries";
import {
  availabilityExceptions,
  availabilityRules,
  bookings,
  bookingStatusHistory,
  clientProfiles,
  serviceOfferings,
  serviceProviders,
} from "@/db/schema";
import type { AuthenticatedDbUser } from "@/lib/authenticated-user";
import {
  isValidTimezone,
  localDateTimeToInstant,
  slotIsAvailable,
} from "@/lib/booking-availability";
import type {
  AvailabilityExceptionDTO,
  AvailabilityRuleDTO,
  BookingAction,
  BookingDTO,
  BookingStatus,
} from "@/lib/booking-domain";

const ACTIVE_STATUSES: BookingStatus[] = ["requested", "confirmed"];

export class BookingServiceError extends Error {
  constructor(
    message: string,
    readonly status = 400,
    readonly code = "BOOKING_ERROR"
  ) {
    super(message);
  }
}

export interface ProviderSettingsInput {
  timezone: string;
  isAcceptingBookings: boolean;
  maxConcurrentBookings: number;
}

export interface ServiceOfferingInput {
  name: string;
  description: string;
  durationMinutes: number;
  priceCents: number;
  currency: string;
  braidStyleId: string | null;
  isActive?: boolean;
}

export interface AvailabilityRuleInput {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface AvailabilityExceptionInput {
  overrideType: "available" | "unavailable";
  localDate: string;
  startTime: string;
  endTime: string;
  reason: string;
}

export interface CreateBookingInput {
  providerId: string;
  serviceOfferingId: string;
  startsAt: string;
  clientNote: string;
  requestKey: string;
}

export interface MutateBookingInput {
  action: BookingAction;
  version: number;
  reason: string;
  startsAt?: string;
}

export async function updateProviderSettings(
  user: AuthenticatedDbUser,
  input: ProviderSettingsInput
) {
  const provider = await requireProvider(user);
  const timezone = input.timezone.trim();
  if (!timezone || !isValidTimezone(timezone)) {
    throw new BookingServiceError("Choose a valid IANA timezone.");
  }

  const maxConcurrentBookings =
    provider.type === "braider"
      ? 1
      : clampInteger(input.maxConcurrentBookings, 1, 20);

  await withRetriedTransaction(async (tx) => {
    await tx
      .select({ id: serviceProviders.id })
      .from(serviceProviders)
      .where(eq(serviceProviders.id, provider.id))
      .for("update");

    if (input.isAcceptingBookings) {
      if (timezone === "UTC") {
        throw new BookingServiceError(
          "Set the provider's local timezone before accepting bookings."
        );
      }
      const [service] = await tx
        .select({ id: serviceOfferings.id })
        .from(serviceOfferings)
        .where(
          and(
            eq(serviceOfferings.providerId, provider.id),
            eq(serviceOfferings.isActive, true)
          )
        )
        .limit(1);
      const [rule] = await tx
        .select({ id: availabilityRules.id })
        .from(availabilityRules)
        .where(
          and(
            eq(availabilityRules.providerId, provider.id),
            eq(availabilityRules.isActive, true)
          )
        )
        .limit(1);
      if (!service || !rule) {
        throw new BookingServiceError(
          "Add an active service and weekly hours before accepting bookings."
        );
      }
    }

    await tx
      .update(serviceProviders)
      .set({
        timezone,
        maxConcurrentBookings,
        isAcceptingBookings: input.isAcceptingBookings,
        updatedAt: new Date(),
      })
      .where(eq(serviceProviders.id, provider.id));
  });

  return getProviderWorkspaceForUser(user);
}

export async function createServiceOffering(
  user: AuthenticatedDbUser,
  input: ServiceOfferingInput
) {
  const provider = await requireProvider(user);
  validateService(input);
  const [service] = await dbWrite(async (tx) =>
    tx
      .insert(serviceOfferings)
      .values({
        providerId: provider.id,
        braidStyleId: input.braidStyleId,
        name: input.name.trim(),
        description: nullableTrimmed(input.description),
        durationMinutes: input.durationMinutes,
        priceCents: input.priceCents,
        currency: input.currency,
        isActive: input.isActive ?? true,
      })
      .returning()
  );
  return service;
}

export async function updateServiceOffering(
  user: AuthenticatedDbUser,
  serviceId: string,
  input: ServiceOfferingInput
) {
  const provider = await requireProvider(user);
  validateService(input);
  const [service] = await dbWrite(async (tx) =>
    tx
      .update(serviceOfferings)
      .set({
        braidStyleId: input.braidStyleId,
        name: input.name.trim(),
        description: nullableTrimmed(input.description),
        durationMinutes: input.durationMinutes,
        priceCents: input.priceCents,
        currency: input.currency,
        isActive: input.isActive ?? true,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(serviceOfferings.id, serviceId),
          eq(serviceOfferings.providerId, provider.id)
        )
      )
      .returning()
  );
  if (!service) {
    throw new BookingServiceError("Service not found.", 404);
  }
  return service;
}

export async function archiveServiceOffering(
  user: AuthenticatedDbUser,
  serviceId: string
) {
  const provider = await requireProvider(user);
  await withRetriedTransaction(async (tx) => {
    const [service] = await tx
      .update(serviceOfferings)
      .set({ isActive: false, updatedAt: new Date() })
      .where(
        and(
          eq(serviceOfferings.id, serviceId),
          eq(serviceOfferings.providerId, provider.id)
        )
      )
      .returning({ id: serviceOfferings.id });
    if (!service) {
      throw new BookingServiceError("Service not found.", 404);
    }

    const [activeService] = await tx
      .select({ id: serviceOfferings.id })
      .from(serviceOfferings)
      .where(
        and(
          eq(serviceOfferings.providerId, provider.id),
          eq(serviceOfferings.isActive, true)
        )
      )
      .limit(1);
    if (!activeService) {
      await tx
        .update(serviceProviders)
        .set({ isAcceptingBookings: false, updatedAt: new Date() })
        .where(eq(serviceProviders.id, provider.id));
    }
  });
}

export async function replaceAvailabilityRules(
  user: AuthenticatedDbUser,
  rules: AvailabilityRuleInput[]
) {
  const provider = await requireProvider(user);
  const normalized = rules.filter((rule) => rule.isActive);
  if (normalized.length > 14) {
    throw new BookingServiceError("A maximum of 14 weekly windows is allowed.");
  }
  for (const rule of normalized) validateRule(rule);

  await withRetriedTransaction(async (tx) => {
    await tx
      .select({ id: serviceProviders.id })
      .from(serviceProviders)
      .where(eq(serviceProviders.id, provider.id))
      .for("update");
    await tx
      .delete(availabilityRules)
      .where(eq(availabilityRules.providerId, provider.id));
    if (normalized.length) {
      await tx.insert(availabilityRules).values(
        normalized.map((rule) => ({
          providerId: provider.id,
          dayOfWeek: rule.dayOfWeek,
          startTime: normalizeClockTime(rule.startTime),
          endTime: normalizeClockTime(rule.endTime),
          isActive: true,
        }))
      );
    } else {
      await tx
        .update(serviceProviders)
        .set({ isAcceptingBookings: false, updatedAt: new Date() })
        .where(eq(serviceProviders.id, provider.id));
    }
  });

  return getProviderWorkspaceForUser(user);
}

export async function createAvailabilityException(
  user: AuthenticatedDbUser,
  input: AvailabilityExceptionInput
) {
  const provider = await requireProvider(user);
  if (!isValidTimezone(provider.timezone) || provider.timezone === "UTC") {
    throw new BookingServiceError(
      "Set the provider timezone before adding schedule exceptions."
    );
  }

  let startsAt: Temporal.Instant;
  let endsAt: Temporal.Instant;
  try {
    startsAt = localDateTimeToInstant(
      input.localDate,
      input.startTime,
      provider.timezone
    );
    endsAt = localDateTimeToInstant(
      input.localDate,
      input.endTime,
      provider.timezone
    );
  } catch {
    throw new BookingServiceError("Enter a valid local date and time.");
  }
  if (Temporal.Instant.compare(startsAt, endsAt) >= 0) {
    throw new BookingServiceError("The end time must be after the start time.");
  }
  if (Temporal.Instant.compare(endsAt, Temporal.Now.instant()) <= 0) {
    throw new BookingServiceError("Schedule exceptions must end in the future.");
  }

  const [exception] = await dbWrite(async (tx) =>
    tx
      .insert(availabilityExceptions)
      .values({
        providerId: provider.id,
        overrideType: input.overrideType,
        startsAt: new Date(startsAt.epochMilliseconds),
        endsAt: new Date(endsAt.epochMilliseconds),
        reason: nullableTrimmed(input.reason),
      })
      .returning()
  );
  return exception;
}

export async function deleteAvailabilityException(
  user: AuthenticatedDbUser,
  exceptionId: string
) {
  const provider = await requireProvider(user);
  const deleted = await dbWrite((tx) =>
    tx
      .delete(availabilityExceptions)
      .where(
        and(
          eq(availabilityExceptions.id, exceptionId),
          eq(availabilityExceptions.providerId, provider.id)
        )
      )
      .returning({ id: availabilityExceptions.id })
  );
  if (!deleted.length) {
    throw new BookingServiceError("Schedule exception not found.", 404);
  }
}

export async function createBookingRequest(
  user: AuthenticatedDbUser,
  input: CreateBookingInput
): Promise<BookingDTO> {
  if (user.role !== "client") {
    throw new BookingServiceError(
      "Only client accounts can request appointments.",
      403
    );
  }
  if (!isUuidLike(input.requestKey)) {
    throw new BookingServiceError("A valid booking request key is required.");
  }
  const clientProfile = await getClientProfileForUser(user.id);
  if (!clientProfile) {
    throw new BookingServiceError("Client profile not found.", 404);
  }

  const bookingId = await withRetriedTransaction(async (tx) => {
    const [provider] = await tx
      .select()
      .from(serviceProviders)
      .where(eq(serviceProviders.id, input.providerId))
      .for("update");
    if (!provider || !provider.isAcceptingBookings) {
      throw new BookingServiceError(
        "This provider is not currently accepting bookings.",
        409,
        "PROVIDER_UNAVAILABLE"
      );
    }

    const [client] = await tx
      .select()
      .from(clientProfiles)
      .where(eq(clientProfiles.id, clientProfile.id))
      .for("update");
    if (!client) {
      throw new BookingServiceError("Client profile not found.", 404);
    }

    const [existing] = await tx
      .select({ id: bookings.id })
      .from(bookings)
      .where(
        and(
          eq(bookings.clientProfileId, client.id),
          eq(bookings.requestKey, input.requestKey)
        )
      )
      .limit(1);
    if (existing) return existing.id;

    const [service] = await tx
      .select()
      .from(serviceOfferings)
      .where(
        and(
          eq(serviceOfferings.id, input.serviceOfferingId),
          eq(serviceOfferings.providerId, provider.id),
          eq(serviceOfferings.isActive, true)
        )
      )
      .limit(1);
    if (!service) {
      throw new BookingServiceError("Service is not available.", 404);
    }

    const startsAt = parseFutureInstant(input.startsAt);
    const endsAt = startsAt.add({ minutes: service.durationMinutes });
    const slotState = await loadSlotState(
      tx,
      provider.id,
      client.id,
      startsAt,
      endsAt
    );
    if (
      !slotIsAvailable({
        timezone: provider.timezone,
        durationMinutes: service.durationMinutes,
        maxConcurrentBookings: provider.maxConcurrentBookings,
        rules: slotState.rules,
        exceptions: slotState.exceptions,
        providerBookings: slotState.providerBookings,
        clientBookings: slotState.clientBookings,
        startsAt: startsAt.toString(),
      })
    ) {
      throw new BookingServiceError(
        "That time is no longer available. Choose another slot.",
        409,
        "SLOT_UNAVAILABLE"
      );
    }

    const [booking] = await tx
      .insert(bookings)
      .values({
        clientProfileId: client.id,
        providerId: provider.id,
        serviceOfferingId: service.id,
        status: "requested",
        startsAt: new Date(startsAt.epochMilliseconds),
        endsAt: new Date(endsAt.epochMilliseconds),
        timezone: provider.timezone,
        serviceName: service.name,
        priceCents: service.priceCents,
        currency: service.currency,
        clientNote: nullableTrimmed(input.clientNote),
        requestKey: input.requestKey,
      })
      .returning({ id: bookings.id });
    await tx.insert(bookingStatusHistory).values({
      bookingId: booking.id,
      fromStatus: null,
      toStatus: "requested",
      changedByUserId: user.id,
      reason: "Appointment requested",
    });
    return booking.id;
  });

  const booking = await getBookingById(bookingId);
  if (!booking) {
    throw new BookingServiceError("Booking could not be loaded.", 500);
  }
  return booking;
}

export async function mutateBooking(
  user: AuthenticatedDbUser,
  bookingId: string,
  input: MutateBookingInput
): Promise<BookingDTO> {
  const actorProvider =
    user.role === "client" ? null : await getProviderForUser(user);
  const actorClient =
    user.role === "client" ? await getClientProfileForUser(user.id) : null;

  await withRetriedTransaction(async (tx) => {
    const [identity] = await tx
      .select({
        providerId: bookings.providerId,
        clientProfileId: bookings.clientProfileId,
      })
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);
    if (!identity) {
      throw new BookingServiceError("Appointment not found.", 404);
    }

    await tx
      .select({ id: serviceProviders.id })
      .from(serviceProviders)
      .where(eq(serviceProviders.id, identity.providerId))
      .for("update");
    await tx
      .select({ id: clientProfiles.id })
      .from(clientProfiles)
      .where(eq(clientProfiles.id, identity.clientProfileId))
      .for("update");

    const [booking] = await tx
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .for("update");
    if (!booking) {
      throw new BookingServiceError("Appointment not found.", 404);
    }
    if (booking.version !== input.version) {
      throw new BookingServiceError(
        "This appointment changed in another session. Refresh and try again.",
        409,
        "VERSION_CONFLICT"
      );
    }

    const actorIsProvider = actorProvider?.id === booking.providerId;
    const actorIsClient = actorClient?.id === booking.clientProfileId;
    if (!actorIsProvider && !actorIsClient) {
      throw new BookingServiceError(
        "You do not have access to this appointment.",
        403
      );
    }
    assertActionAllowed(
      booking.status,
      input.action,
      actorIsProvider ? "provider" : "client",
      booking.startsAt,
      booking.endsAt
    );

    let nextStatus: BookingStatus = booking.status;
    let nextStartsAt = booking.startsAt;
    let nextEndsAt = booking.endsAt;
    let cancellationReason = booking.cancellationReason;

    if (input.action === "reschedule") {
      if (!input.startsAt) {
        throw new BookingServiceError("Choose a new appointment time.");
      }
      const [provider] = await tx
        .select()
        .from(serviceProviders)
        .where(eq(serviceProviders.id, booking.providerId))
        .limit(1);
      const [service] = await tx
        .select()
        .from(serviceOfferings)
        .where(eq(serviceOfferings.id, booking.serviceOfferingId))
        .limit(1);
      if (!provider || !service || !service.isActive) {
        throw new BookingServiceError(
          "This service can no longer be rescheduled.",
          409
        );
      }
      const start = parseFutureInstant(input.startsAt);
      const end = start.add({ minutes: service.durationMinutes });
      const slotState = await loadSlotState(
        tx,
        booking.providerId,
        booking.clientProfileId,
        start,
        end,
        booking.id
      );
      if (
        !slotIsAvailable({
          timezone: provider.timezone,
          durationMinutes: service.durationMinutes,
          maxConcurrentBookings: provider.maxConcurrentBookings,
          rules: slotState.rules,
          exceptions: slotState.exceptions,
          providerBookings: slotState.providerBookings,
          clientBookings: slotState.clientBookings,
          startsAt: start.toString(),
        })
      ) {
        throw new BookingServiceError(
          "That time is no longer available. Choose another slot.",
          409,
          "SLOT_UNAVAILABLE"
        );
      }
      nextStartsAt = new Date(start.epochMilliseconds);
      nextEndsAt = new Date(end.epochMilliseconds);
      nextStatus = "requested";
      cancellationReason = null;
    } else {
      nextStatus = statusForAction(input.action);
      if (input.action === "cancel" || input.action === "decline") {
        cancellationReason = nullableTrimmed(input.reason);
      }
    }

    await tx
      .update(bookings)
      .set({
        status: nextStatus,
        startsAt: nextStartsAt,
        endsAt: nextEndsAt,
        cancellationReason,
        version: sql`${bookings.version} + 1`,
        updatedAt: new Date(),
      })
      .where(
        and(eq(bookings.id, booking.id), eq(bookings.version, input.version))
      );

    if (nextStatus !== booking.status) {
      await tx.insert(bookingStatusHistory).values({
        bookingId: booking.id,
        fromStatus: booking.status,
        toStatus: nextStatus,
        changedByUserId: user.id,
        reason:
          nullableTrimmed(input.reason) ??
          (input.action === "reschedule"
            ? "Appointment rescheduled"
            : `Appointment ${input.action.replace("_", " ")}`),
      });
    }
  });

  const updated = await getBookingById(bookingId);
  if (!updated) {
    throw new BookingServiceError("Appointment could not be loaded.", 500);
  }
  return updated;
}

async function loadSlotState(
  tx: TransactionDatabase,
  providerId: string,
  clientProfileId: string,
  startsAt: Temporal.Instant,
  endsAt: Temporal.Instant,
  excludeBookingId?: string
) {
  const startDate = new Date(startsAt.epochMilliseconds);
  const endDate = new Date(endsAt.epochMilliseconds);
  const overlapConditions = [
    inArray(bookings.status, ACTIVE_STATUSES),
    lt(bookings.startsAt, endDate),
    gt(bookings.endsAt, startDate),
  ];
  if (excludeBookingId) {
    overlapConditions.push(ne(bookings.id, excludeBookingId));
  }

  const [ruleRows, exceptionRows, providerRows, clientRows] =
    await Promise.all([
      tx
        .select()
        .from(availabilityRules)
        .where(
          and(
            eq(availabilityRules.providerId, providerId),
            eq(availabilityRules.isActive, true)
          )
        ),
      tx
        .select()
        .from(availabilityExceptions)
        .where(
          and(
            eq(availabilityExceptions.providerId, providerId),
            lt(availabilityExceptions.startsAt, endDate),
            gt(availabilityExceptions.endsAt, startDate)
          )
        ),
      tx
        .select({ startsAt: bookings.startsAt, endsAt: bookings.endsAt })
        .from(bookings)
        .where(and(eq(bookings.providerId, providerId), ...overlapConditions)),
      tx
        .select({ startsAt: bookings.startsAt, endsAt: bookings.endsAt })
        .from(bookings)
        .where(
          and(
            eq(bookings.clientProfileId, clientProfileId),
            ...overlapConditions
          )
        ),
    ]);

  return {
    rules: ruleRows.map(mapRule),
    exceptions: exceptionRows.map(mapException),
    providerBookings: providerRows.map(mapBusyRange),
    clientBookings: clientRows.map(mapBusyRange),
  };
}

function assertActionAllowed(
  status: BookingStatus,
  action: BookingAction,
  actor: "provider" | "client",
  startsAt: Date,
  endsAt: Date
) {
  const allowedForClient: Record<BookingStatus, BookingAction[]> = {
    requested: ["cancel", "reschedule"],
    confirmed: ["cancel", "reschedule"],
    declined: [],
    cancelled: [],
    completed: [],
    no_show: [],
  };
  const allowedForProvider: Record<BookingStatus, BookingAction[]> = {
    requested: ["confirm", "decline", "cancel", "reschedule"],
    confirmed: ["cancel", "complete", "no_show", "reschedule"],
    declined: [],
    cancelled: [],
    completed: [],
    no_show: [],
  };
  const allowed =
    actor === "provider" ? allowedForProvider[status] : allowedForClient[status];
  if (!allowed.includes(action)) {
    throw new BookingServiceError(
      `This ${status} appointment cannot be ${action.replace("_", " ")}d.`,
      409,
      "INVALID_TRANSITION"
    );
  }

  const now = Date.now();
  if (action === "complete" && endsAt.getTime() > now) {
    throw new BookingServiceError(
      "An appointment can be completed after its scheduled end."
    );
  }
  if (action === "no_show" && startsAt.getTime() > now) {
    throw new BookingServiceError(
      "An appointment can be marked no-show after its scheduled start."
    );
  }
}

function statusForAction(action: BookingAction): BookingStatus {
  const statuses: Record<Exclude<BookingAction, "reschedule">, BookingStatus> = {
    confirm: "confirmed",
    decline: "declined",
    cancel: "cancelled",
    complete: "completed",
    no_show: "no_show",
  };
  if (action === "reschedule") return "requested";
  return statuses[action];
}

async function requireProvider(user: AuthenticatedDbUser) {
  if (user.role !== "salon_owner" && user.role !== "braider") {
    throw new BookingServiceError(
      "Only Salon and Braider accounts can manage booking availability.",
      403
    );
  }
  const provider = await getProviderForUser(user);
  if (!provider) {
    throw new BookingServiceError("Booking provider profile not found.", 404);
  }
  return provider;
}

async function withRetriedTransaction<T>(
  work: (tx: TransactionDatabase) => Promise<T>
) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await withBookingTransaction(work);
    } catch (error) {
      if (attempt === 2 || !isRetryableBookingTransactionError(error)) {
        throw error;
      }
    }
  }
  throw new BookingServiceError("Booking transaction failed.", 500);
}

async function dbWrite<T>(
  work: (tx: TransactionDatabase) => Promise<T>
) {
  return withRetriedTransaction(work);
}

function validateService(input: ServiceOfferingInput) {
  if (!input.name.trim() || input.name.trim().length > 100) {
    throw new BookingServiceError(
      "Service name must be between 1 and 100 characters."
    );
  }
  if (
    !Number.isInteger(input.durationMinutes) ||
    input.durationMinutes < 15 ||
    input.durationMinutes > 720
  ) {
    throw new BookingServiceError(
      "Service duration must be between 15 and 720 minutes."
    );
  }
  if (
    !Number.isInteger(input.priceCents) ||
    input.priceCents < 0 ||
    input.priceCents > 2_000_000
  ) {
    throw new BookingServiceError("Enter a valid service price.");
  }
  if (!/^[A-Z]{3}$/.test(input.currency)) {
    throw new BookingServiceError("Currency must use a three-letter code.");
  }
  if (input.description.trim().length > 500) {
    throw new BookingServiceError(
      "Service description must be 500 characters or fewer."
    );
  }
}

function validateRule(rule: AvailabilityRuleInput) {
  if (!Number.isInteger(rule.dayOfWeek) || rule.dayOfWeek < 0 || rule.dayOfWeek > 6) {
    throw new BookingServiceError("Availability day is invalid.");
  }
  const start = normalizeClockTime(rule.startTime);
  const end = normalizeClockTime(rule.endTime);
  if (start >= end) {
    throw new BookingServiceError(
      "Each availability window must end after it starts."
    );
  }
}

function normalizeClockTime(value: string) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(value);
  if (!match) {
    throw new BookingServiceError("Use a valid 24-hour time.");
  }
  return `${match[1]}:${match[2]}:${match[3] ?? "00"}`;
}

function parseFutureInstant(value: string) {
  let instant: Temporal.Instant;
  try {
    instant = Temporal.Instant.from(value);
  } catch {
    throw new BookingServiceError("Choose a valid appointment time.");
  }
  if (
    Temporal.Instant.compare(
      instant,
      Temporal.Now.instant().add({ minutes: 120 })
    ) < 0
  ) {
    throw new BookingServiceError(
      "Appointments require at least two hours of lead time."
    );
  }
  return instant;
}

function clampInteger(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function nullableTrimmed(value: string) {
  const trimmed = value.trim();
  return trimmed || null;
}

function isUuidLike(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function mapRule(
  row: typeof availabilityRules.$inferSelect
): AvailabilityRuleDTO {
  return {
    id: row.id,
    dayOfWeek: row.dayOfWeek,
    startTime: row.startTime,
    endTime: row.endTime,
    effectiveFrom: row.effectiveFrom,
    effectiveUntil: row.effectiveUntil,
    isActive: row.isActive,
  };
}

function mapException(
  row: typeof availabilityExceptions.$inferSelect
): AvailabilityExceptionDTO {
  return {
    id: row.id,
    overrideType: row.overrideType,
    startsAt: row.startsAt.toISOString(),
    endsAt: row.endsAt.toISOString(),
    reason: row.reason ?? "",
  };
}

function mapBusyRange(row: { startsAt: Date; endsAt: Date }) {
  return {
    startsAt: row.startsAt.toISOString(),
    endsAt: row.endsAt.toISOString(),
  };
}
