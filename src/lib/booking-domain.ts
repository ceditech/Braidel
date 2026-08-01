import type { DashboardRole } from "@/lib/roles";

export const BOOKING_STATUSES = [
  "requested",
  "confirmed",
  "declined",
  "cancelled",
  "completed",
  "no_show",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type BookingAction =
  | "confirm"
  | "decline"
  | "cancel"
  | "complete"
  | "no_show"
  | "reschedule";

export interface BookingServiceDTO {
  id: string;
  providerId: string;
  braidStyleId: string | null;
  braidStyleName: string | null;
  name: string;
  description: string;
  durationMinutes: number;
  priceCents: number;
  currency: string;
  isActive: boolean;
}

export interface AvailabilityRuleDTO {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  effectiveFrom: string | null;
  effectiveUntil: string | null;
  isActive: boolean;
}

export interface AvailabilityExceptionDTO {
  id: string;
  overrideType: "available" | "unavailable";
  startsAt: string;
  endsAt: string;
  reason: string;
}

export interface BookingProviderDTO {
  id: string;
  type: "salon" | "braider";
  name: string;
  slug: string;
  city: string;
  state: string;
  timezone: string;
  isAcceptingBookings: boolean;
  maxConcurrentBookings: number;
}

export interface BookableProviderDTO extends BookingProviderDTO {
  services: BookingServiceDTO[];
}

export interface BookingDTO {
  id: string;
  serviceOfferingId: string;
  status: BookingStatus;
  startsAt: string;
  endsAt: string;
  timezone: string;
  serviceName: string;
  priceCents: number;
  currency: string;
  clientNote: string;
  cancellationReason: string;
  version: number;
  createdAt: string;
  provider: BookingProviderDTO;
  client: {
    id: string;
    name: string;
    email: string;
  };
  review: {
    score: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
    providerResponse: {
      body: string;
      createdAt: string;
      updatedAt: string;
    } | null;
    history: Array<{
      action: "created" | "updated";
      previousScore: number | null;
      previousComment: string;
      newScore: number;
      newComment: string;
      createdAt: string;
    }>;
  } | null;
}

export interface ProviderBookingWorkspaceDTO extends BookingProviderDTO {
  services: BookingServiceDTO[];
  rules: AvailabilityRuleDTO[];
  exceptions: AvailabilityExceptionDTO[];
}

export interface BookingWorkspaceDTO {
  role: DashboardRole;
  profileTimezone: string;
  provider: ProviderBookingWorkspaceDTO | null;
  bookableProviders: BookableProviderDTO[];
  bookings: BookingDTO[];
  braidStyles: Array<{ id: string; name: string }>;
}

export interface AvailabilitySlotDTO {
  startsAt: string;
  endsAt: string;
  localDate: string;
  localTime: string;
}

export interface AvailabilityResponseDTO {
  provider: BookingProviderDTO;
  service: BookingServiceDTO;
  slots: AvailabilitySlotDTO[];
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  declined: "Declined",
  cancelled: "Cancelled",
  completed: "Completed",
  no_show: "No-show",
};

export function isBookingStatus(value: unknown): value is BookingStatus {
  return (
    typeof value === "string" &&
    BOOKING_STATUSES.includes(value as BookingStatus)
  );
}

export function formatBookingMoney(priceCents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(priceCents / 100);
}

export function formatBookingDateTime(
  value: string,
  timezone: string,
  options: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    ...options,
  }).format(new Date(value));
}

export function bookingDateKey(value: string, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}
