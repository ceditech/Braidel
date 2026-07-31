import "server-only";

import {
  and,
  asc,
  desc,
  eq,
  gt,
  inArray,
  isNull,
  or,
} from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "@/db";
import {
  availabilityExceptions,
  availabilityRules,
  bookings,
  braidStyles,
  braiders,
  clientProfiles,
  ratings,
  salons,
  serviceOfferings,
  serviceProviders,
  users,
} from "@/db/schema";
import type { AuthenticatedDbUser } from "@/lib/authenticated-user";
import type {
  AvailabilityExceptionDTO,
  AvailabilityRuleDTO,
  BookableProviderDTO,
  BookingDTO,
  BookingProviderDTO,
  BookingServiceDTO,
  BookingWorkspaceDTO,
  ProviderBookingWorkspaceDTO,
} from "@/lib/booking-domain";
import { toDashboardRole } from "@/lib/roles";

const clientUser = alias(users, "booking_client_user");
const braiderUser = alias(users, "booking_braider_user");
const salonOwner = alias(users, "booking_salon_owner");

export async function getBookingWorkspace(
  user: AuthenticatedDbUser
): Promise<BookingWorkspaceDTO> {
  const provider =
    user.role === "client" ? null : await getProviderWorkspaceForUser(user);
  const clientProfile =
    user.role === "client" ? await getClientProfileForUser(user.id) : null;

  const [workspaceBookings, bookableProviders, styleRows] = await Promise.all([
    provider
      ? getBookingsForProvider(provider.id)
      : clientProfile
        ? getBookingsForClient(clientProfile.id)
        : Promise.resolve([]),
    user.role === "client" ? getBookableProviders() : Promise.resolve([]),
    user.role === "client"
      ? Promise.resolve([])
      : db
          .select({ id: braidStyles.id, name: braidStyles.name })
          .from(braidStyles)
          .orderBy(asc(braidStyles.name)),
  ]);

  return {
    role: toDashboardRole(user.role),
    profileTimezone:
      provider?.timezone ?? clientProfile?.timezone ?? "UTC",
    provider,
    bookableProviders,
    bookings: workspaceBookings,
    braidStyles: styleRows,
  };
}

export async function getProviderWorkspaceForUser(
  user: AuthenticatedDbUser
): Promise<ProviderBookingWorkspaceDTO | null> {
  const provider = await getProviderForUser(user);
  if (!provider) return null;

  const [services, rules, exceptions] = await Promise.all([
    getServicesForProvider(provider.id, false),
    getRulesForProvider(provider.id),
    getExceptionsForProvider(provider.id),
  ]);

  return { ...provider, services, rules, exceptions };
}

export async function getProviderForUser(
  user: Pick<AuthenticatedDbUser, "id" | "role">
): Promise<BookingProviderDTO | null> {
  if (user.role === "salon_owner") {
    const [row] = await db
      .select({
        id: serviceProviders.id,
        type: serviceProviders.providerType,
        name: salons.name,
        slug: salons.slug,
        city: salons.city,
        state: salons.state,
        timezone: serviceProviders.timezone,
        isAcceptingBookings: serviceProviders.isAcceptingBookings,
        maxConcurrentBookings: serviceProviders.maxConcurrentBookings,
      })
      .from(serviceProviders)
      .innerJoin(salons, eq(serviceProviders.salonId, salons.id))
      .where(eq(salons.ownerId, user.id))
      .limit(1);
    return row ? mapProvider(row) : null;
  }

  if (user.role === "braider") {
    const [row] = await db
      .select({
        id: serviceProviders.id,
        type: serviceProviders.providerType,
        firstName: users.firstName,
        lastName: users.lastName,
        slug: braiders.slug,
        city: braiders.city,
        state: braiders.state,
        timezone: serviceProviders.timezone,
        isAcceptingBookings: serviceProviders.isAcceptingBookings,
        maxConcurrentBookings: serviceProviders.maxConcurrentBookings,
      })
      .from(serviceProviders)
      .innerJoin(braiders, eq(serviceProviders.braiderId, braiders.id))
      .innerJoin(users, eq(braiders.userId, users.id))
      .where(eq(braiders.userId, user.id))
      .limit(1);
    return row
      ? mapProvider({
          ...row,
          name: `${row.firstName} ${row.lastName}`.trim(),
        })
      : null;
  }

  return null;
}

export async function getClientProfileForUser(userId: string) {
  const [profile] = await db
    .select({
      id: clientProfiles.id,
      timezone: clientProfiles.timezone,
    })
    .from(clientProfiles)
    .where(eq(clientProfiles.userId, userId))
    .limit(1);
  return profile ?? null;
}

export async function getServicesForProvider(
  providerId: string,
  activeOnly = true
): Promise<BookingServiceDTO[]> {
  const rows = await db
    .select({
      id: serviceOfferings.id,
      providerId: serviceOfferings.providerId,
      braidStyleId: serviceOfferings.braidStyleId,
      braidStyleName: braidStyles.name,
      name: serviceOfferings.name,
      description: serviceOfferings.description,
      durationMinutes: serviceOfferings.durationMinutes,
      priceCents: serviceOfferings.priceCents,
      currency: serviceOfferings.currency,
      isActive: serviceOfferings.isActive,
    })
    .from(serviceOfferings)
    .leftJoin(braidStyles, eq(serviceOfferings.braidStyleId, braidStyles.id))
    .where(
      activeOnly
        ? and(
            eq(serviceOfferings.providerId, providerId),
            eq(serviceOfferings.isActive, true)
          )
        : eq(serviceOfferings.providerId, providerId)
    )
    .orderBy(desc(serviceOfferings.isActive), asc(serviceOfferings.name));

  return rows.map(mapService);
}

export async function getRulesForProvider(
  providerId: string
): Promise<AvailabilityRuleDTO[]> {
  const rows = await db
    .select()
    .from(availabilityRules)
    .where(eq(availabilityRules.providerId, providerId))
    .orderBy(
      asc(availabilityRules.dayOfWeek),
      asc(availabilityRules.startTime)
    );
  return rows.map(mapRule);
}

export async function getExceptionsForProvider(
  providerId: string
): Promise<AvailabilityExceptionDTO[]> {
  const rows = await db
    .select()
    .from(availabilityExceptions)
    .where(
      and(
        eq(availabilityExceptions.providerId, providerId),
        gt(availabilityExceptions.endsAt, new Date())
      )
    )
    .orderBy(asc(availabilityExceptions.startsAt));
  return rows.map(mapException);
}

export async function getBookableProviders(): Promise<BookableProviderDTO[]> {
  const rows = await db
    .select({
      providerId: serviceProviders.id,
      type: serviceProviders.providerType,
      timezone: serviceProviders.timezone,
      isAcceptingBookings: serviceProviders.isAcceptingBookings,
      maxConcurrentBookings: serviceProviders.maxConcurrentBookings,
      salonName: salons.name,
      salonSlug: salons.slug,
      salonCity: salons.city,
      salonState: salons.state,
      braiderFirstName: braiderUser.firstName,
      braiderLastName: braiderUser.lastName,
      braiderSlug: braiders.slug,
      braiderCity: braiders.city,
      braiderState: braiders.state,
      serviceId: serviceOfferings.id,
      braidStyleId: serviceOfferings.braidStyleId,
      braidStyleName: braidStyles.name,
      serviceName: serviceOfferings.name,
      serviceDescription: serviceOfferings.description,
      durationMinutes: serviceOfferings.durationMinutes,
      priceCents: serviceOfferings.priceCents,
      currency: serviceOfferings.currency,
      serviceActive: serviceOfferings.isActive,
    })
    .from(serviceProviders)
    .innerJoin(
      serviceOfferings,
      and(
        eq(serviceOfferings.providerId, serviceProviders.id),
        eq(serviceOfferings.isActive, true)
      )
    )
    .leftJoin(salons, eq(serviceProviders.salonId, salons.id))
    .leftJoin(salonOwner, eq(salons.ownerId, salonOwner.id))
    .leftJoin(braiders, eq(serviceProviders.braiderId, braiders.id))
    .leftJoin(braiderUser, eq(braiders.userId, braiderUser.id))
    .leftJoin(braidStyles, eq(serviceOfferings.braidStyleId, braidStyles.id))
    .where(
      and(
        eq(serviceProviders.isAcceptingBookings, true),
        or(
          and(
            eq(serviceProviders.providerType, "salon"),
            isNull(salonOwner.deletedAt)
          ),
          and(
            eq(serviceProviders.providerType, "braider"),
            isNull(braiderUser.deletedAt)
          )
        )
      )
    )
    .orderBy(asc(salons.name), asc(braiderUser.firstName), asc(serviceOfferings.name));

  const grouped = new Map<string, BookableProviderDTO>();
  for (const row of rows) {
    const provider = grouped.get(row.providerId) ?? {
      id: row.providerId,
      type: row.type,
      name:
        row.type === "salon"
          ? row.salonName ?? "Salon"
          : `${row.braiderFirstName ?? ""} ${row.braiderLastName ?? ""}`.trim() ||
            "Braider",
      slug:
        row.type === "salon"
          ? row.salonSlug ?? ""
          : row.braiderSlug ?? "",
      city:
        row.type === "salon"
          ? row.salonCity ?? ""
          : row.braiderCity ?? "",
      state:
        row.type === "salon"
          ? row.salonState ?? ""
          : row.braiderState ?? "",
      timezone: row.timezone,
      isAcceptingBookings: row.isAcceptingBookings,
      maxConcurrentBookings: row.maxConcurrentBookings,
      services: [],
    };
    provider.services.push(
      mapService({
        id: row.serviceId,
        providerId: row.providerId,
        braidStyleId: row.braidStyleId,
        braidStyleName: row.braidStyleName,
        name: row.serviceName,
        description: row.serviceDescription,
        durationMinutes: row.durationMinutes,
        priceCents: row.priceCents,
        currency: row.currency,
        isActive: row.serviceActive,
      })
    );
    grouped.set(row.providerId, provider);
  }
  return [...grouped.values()];
}

export async function getBookingsForProvider(
  providerId: string
): Promise<BookingDTO[]> {
  return getBookings(and(eq(bookings.providerId, providerId)));
}

export async function getBookingsForClient(
  clientProfileId: string
): Promise<BookingDTO[]> {
  return getBookings(eq(bookings.clientProfileId, clientProfileId));
}

export async function getBookingById(
  bookingId: string
): Promise<BookingDTO | null> {
  const rows = await getBookings(eq(bookings.id, bookingId));
  return rows[0] ?? null;
}

export async function getAvailabilityData(
  providerId: string,
  serviceId: string,
  clientProfileId?: string
) {
  const [providerRow] = await db
    .select({
      id: serviceProviders.id,
      type: serviceProviders.providerType,
      timezone: serviceProviders.timezone,
      isAcceptingBookings: serviceProviders.isAcceptingBookings,
      maxConcurrentBookings: serviceProviders.maxConcurrentBookings,
      salonName: salons.name,
      salonSlug: salons.slug,
      salonCity: salons.city,
      salonState: salons.state,
      braiderFirstName: braiderUser.firstName,
      braiderLastName: braiderUser.lastName,
      braiderSlug: braiders.slug,
      braiderCity: braiders.city,
      braiderState: braiders.state,
    })
    .from(serviceProviders)
    .leftJoin(salons, eq(serviceProviders.salonId, salons.id))
    .leftJoin(braiders, eq(serviceProviders.braiderId, braiders.id))
    .leftJoin(braiderUser, eq(braiders.userId, braiderUser.id))
    .where(eq(serviceProviders.id, providerId))
    .limit(1);

  if (!providerRow) return null;

  const [service] = await db
    .select({
      id: serviceOfferings.id,
      providerId: serviceOfferings.providerId,
      braidStyleId: serviceOfferings.braidStyleId,
      braidStyleName: braidStyles.name,
      name: serviceOfferings.name,
      description: serviceOfferings.description,
      durationMinutes: serviceOfferings.durationMinutes,
      priceCents: serviceOfferings.priceCents,
      currency: serviceOfferings.currency,
      isActive: serviceOfferings.isActive,
    })
    .from(serviceOfferings)
    .leftJoin(braidStyles, eq(serviceOfferings.braidStyleId, braidStyles.id))
    .where(
      and(
        eq(serviceOfferings.id, serviceId),
        eq(serviceOfferings.providerId, providerId)
      )
    )
    .limit(1);
  if (!service) return null;

  const [rules, exceptions, providerBookings, clientBookings] =
    await Promise.all([
      getRulesForProvider(providerId),
      getExceptionsForProvider(providerId),
      getBusyRanges(eq(bookings.providerId, providerId)),
      clientProfileId
        ? getBusyRanges(eq(bookings.clientProfileId, clientProfileId))
        : Promise.resolve([]),
    ]);

  const provider = mapProvider({
    id: providerRow.id,
    type: providerRow.type,
    name:
      providerRow.type === "salon"
        ? providerRow.salonName ?? "Salon"
        : `${providerRow.braiderFirstName ?? ""} ${
            providerRow.braiderLastName ?? ""
          }`.trim() || "Braider",
    slug:
      providerRow.type === "salon"
        ? providerRow.salonSlug ?? ""
        : providerRow.braiderSlug ?? "",
    city:
      providerRow.type === "salon"
        ? providerRow.salonCity
        : providerRow.braiderCity,
    state:
      providerRow.type === "salon"
        ? providerRow.salonState
        : providerRow.braiderState,
    timezone: providerRow.timezone,
    isAcceptingBookings: providerRow.isAcceptingBookings,
    maxConcurrentBookings: providerRow.maxConcurrentBookings,
  });

  return {
    provider,
    service: mapService(service),
    rules,
    exceptions,
    providerBookings,
    clientBookings,
  };
}

async function getBookings(
  condition: ReturnType<typeof eq> | ReturnType<typeof and>
): Promise<BookingDTO[]> {
  const rows = await db
    .select({
      id: bookings.id,
      serviceOfferingId: bookings.serviceOfferingId,
      status: bookings.status,
      startsAt: bookings.startsAt,
      endsAt: bookings.endsAt,
      timezone: bookings.timezone,
      serviceName: bookings.serviceName,
      priceCents: bookings.priceCents,
      currency: bookings.currency,
      clientNote: bookings.clientNote,
      cancellationReason: bookings.cancellationReason,
      version: bookings.version,
      createdAt: bookings.createdAt,
      clientId: clientProfiles.id,
      clientFirstName: clientUser.firstName,
      clientLastName: clientUser.lastName,
      clientEmail: clientUser.email,
      providerId: serviceProviders.id,
      providerType: serviceProviders.providerType,
      providerTimezone: serviceProviders.timezone,
      isAcceptingBookings: serviceProviders.isAcceptingBookings,
      maxConcurrentBookings: serviceProviders.maxConcurrentBookings,
      salonName: salons.name,
      salonSlug: salons.slug,
      salonCity: salons.city,
      salonState: salons.state,
      braiderFirstName: braiderUser.firstName,
      braiderLastName: braiderUser.lastName,
      braiderSlug: braiders.slug,
      braiderCity: braiders.city,
      braiderState: braiders.state,
      reviewScore: ratings.score,
      reviewComment: ratings.comment,
    })
    .from(bookings)
    .innerJoin(
      clientProfiles,
      eq(bookings.clientProfileId, clientProfiles.id)
    )
    .innerJoin(clientUser, eq(clientProfiles.userId, clientUser.id))
    .innerJoin(serviceProviders, eq(bookings.providerId, serviceProviders.id))
    .leftJoin(salons, eq(serviceProviders.salonId, salons.id))
    .leftJoin(braiders, eq(serviceProviders.braiderId, braiders.id))
    .leftJoin(braiderUser, eq(braiders.userId, braiderUser.id))
    .leftJoin(
      ratings,
      and(eq(ratings.bookingId, bookings.id), eq(ratings.reviewerId, clientUser.id))
    )
    .where(condition)
    .orderBy(asc(bookings.startsAt));

  return rows.map((row) => ({
    id: row.id,
    serviceOfferingId: row.serviceOfferingId,
    status: row.status,
    startsAt: toIso(row.startsAt),
    endsAt: toIso(row.endsAt),
    timezone: row.timezone,
    serviceName: row.serviceName,
    priceCents: row.priceCents,
    currency: row.currency,
    clientNote: row.clientNote ?? "",
    cancellationReason: row.cancellationReason ?? "",
    version: row.version,
    createdAt: toIso(row.createdAt),
    client: {
      id: row.clientId,
      name: `${row.clientFirstName} ${row.clientLastName}`.trim(),
      email: row.clientEmail,
    },
    provider: mapProvider({
      id: row.providerId,
      type: row.providerType,
      name:
        row.providerType === "salon"
          ? row.salonName ?? "Salon"
          : `${row.braiderFirstName ?? ""} ${
              row.braiderLastName ?? ""
            }`.trim() || "Braider",
      slug:
        row.providerType === "salon"
          ? row.salonSlug ?? ""
          : row.braiderSlug ?? "",
      city:
        row.providerType === "salon" ? row.salonCity : row.braiderCity,
      state:
        row.providerType === "salon" ? row.salonState : row.braiderState,
      timezone: row.providerTimezone,
      isAcceptingBookings: row.isAcceptingBookings,
      maxConcurrentBookings: row.maxConcurrentBookings,
    }),
    review:
      row.reviewScore === null
        ? null
        : { score: row.reviewScore, comment: row.reviewComment ?? "" },
  }));
}

async function getBusyRanges(
  identityCondition: ReturnType<typeof eq>
) {
  const rows = await db
    .select({
      startsAt: bookings.startsAt,
      endsAt: bookings.endsAt,
    })
    .from(bookings)
    .where(
      and(
        identityCondition,
        inArray(bookings.status, ["requested", "confirmed"]),
        gt(bookings.endsAt, new Date())
      )
    );
  return rows.map((row) => ({
    startsAt: toIso(row.startsAt),
    endsAt: toIso(row.endsAt),
  }));
}

function mapProvider(row: {
  id: string;
  type: "salon" | "braider";
  name: string;
  slug: string;
  city: string | null;
  state: string | null;
  timezone: string;
  isAcceptingBookings: boolean;
  maxConcurrentBookings: number;
}): BookingProviderDTO {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    slug: row.slug,
    city: row.city ?? "",
    state: row.state ?? "",
    timezone: row.timezone,
    isAcceptingBookings: row.isAcceptingBookings,
    maxConcurrentBookings: row.maxConcurrentBookings,
  };
}

function mapService(row: {
  id: string;
  providerId: string;
  braidStyleId: string | null;
  braidStyleName: string | null;
  name: string;
  description: string | null;
  durationMinutes: number;
  priceCents: number;
  currency: string;
  isActive: boolean;
}): BookingServiceDTO {
  return {
    ...row,
    description: row.description ?? "",
  };
}

function mapRule(row: typeof availabilityRules.$inferSelect): AvailabilityRuleDTO {
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
    startsAt: toIso(row.startsAt),
    endsAt: toIso(row.endsAt),
    reason: row.reason ?? "",
  };
}

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}
