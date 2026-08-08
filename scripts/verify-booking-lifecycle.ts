import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const [{ Temporal }, { and, eq }, { db }, schema, availability, bookingQueries, bookingService] =
    await Promise.all([
    import("@js-temporal/polyfill"),
    import("drizzle-orm"),
    import("../src/db/index"),
    import("../src/db/schema"),
    import("../src/lib/booking-availability"),
    import("../src/db/booking-queries"),
    import("../src/lib/booking-service"),
  ]);

  let createdBookingId = "";

  try {
  const [clientRow] = await db
    .select({
      id: schema.users.id,
      clerkId: schema.users.clerkId,
      role: schema.users.role,
      firstName: schema.users.firstName,
      lastName: schema.users.lastName,
      email: schema.users.email,
      onboardedAt: schema.users.onboardedAt,
    })
    .from(schema.users)
    .where(eq(schema.users.clerkId, "seed_booking_client"))
    .limit(1);
  if (!clientRow || clientRow.role !== "client") {
    throw new Error("Seed booking client is missing. Run npm run db:seed.");
  }

  const [providerRow] = await db
    .select({
      id: schema.serviceProviders.id,
      type: schema.serviceProviders.providerType,
      salonOwnerId: schema.salons.ownerId,
      braiderUserId: schema.braiders.userId,
    })
    .from(schema.serviceProviders)
    .leftJoin(
      schema.salons,
      eq(schema.serviceProviders.salonId, schema.salons.id)
    )
    .leftJoin(
      schema.braiders,
      eq(schema.serviceProviders.braiderId, schema.braiders.id)
    )
    .where(eq(schema.serviceProviders.isAcceptingBookings, true))
    .limit(1);
  if (!providerRow) throw new Error("No accepting seed provider is available.");

  const [service] = await db
    .select({ id: schema.serviceOfferings.id })
    .from(schema.serviceOfferings)
    .where(
      and(
        eq(schema.serviceOfferings.providerId, providerRow.id),
        eq(schema.serviceOfferings.isActive, true)
      )
    )
    .limit(1);
  if (!service) throw new Error("The seed provider has no active service.");

  const clientProfile = await bookingQueries.getClientProfileForUser(
    clientRow.id
  );
  if (!clientProfile) throw new Error("Seed client profile is missing.");

  const data = await bookingQueries.getAvailabilityData(
    providerRow.id,
    service.id,
    clientProfile.id
  );
  if (!data) throw new Error("Availability data could not be loaded.");

  const firstDate = Temporal.Now.zonedDateTimeISO(data.provider.timezone)
    .toPlainDate()
    .add({ days: 1 })
    .toString();
  const slots = availability.getAvailabilitySlots({
    timezone: data.provider.timezone,
    durationMinutes: data.service.durationMinutes,
    maxConcurrentBookings: data.provider.maxConcurrentBookings,
    startDate: firstDate,
    days: 14,
    rules: data.rules,
    exceptions: data.exceptions,
    providerBookings: data.providerBookings,
    clientBookings: data.clientBookings,
  });
  if (!slots.length) throw new Error("No seed availability slot was generated.");

  const clientUser = {
    ...clientRow,
    role: "client" as const,
  };
  const requested = await bookingService.createBookingRequest(clientUser, {
    providerId: providerRow.id,
    serviceOfferingId: service.id,
    startsAt: slots[0].startsAt,
    clientNote: "Automated booking lifecycle smoke test.",
    requestKey: crypto.randomUUID(),
  });
  createdBookingId = requested.id;
  if (requested.status !== "requested") {
    throw new Error("Booking did not enter requested status.");
  }

  const providerUserId =
    providerRow.type === "salon"
      ? providerRow.salonOwnerId
      : providerRow.braiderUserId;
  if (!providerUserId) throw new Error("Provider owner identity is missing.");
  const [providerUserRow] = await db
    .select({
      id: schema.users.id,
      clerkId: schema.users.clerkId,
      role: schema.users.role,
      firstName: schema.users.firstName,
      lastName: schema.users.lastName,
      email: schema.users.email,
      onboardedAt: schema.users.onboardedAt,
    })
    .from(schema.users)
    .where(eq(schema.users.id, providerUserId))
    .limit(1);
  if (!providerUserRow) throw new Error("Provider user is missing.");

  const confirmed = await bookingService.mutateBooking(
    providerUserRow,
    requested.id,
    {
      action: "confirm",
      version: requested.version,
      reason: "Smoke test confirmation",
    }
  );
  if (confirmed.status !== "confirmed") {
    throw new Error("Provider confirmation failed.");
  }

  const cancelled = await bookingService.mutateBooking(
    clientUser,
    requested.id,
    {
      action: "cancel",
      version: confirmed.version,
      reason: "Smoke test cleanup",
    }
  );
  if (cancelled.status !== "cancelled") {
    throw new Error("Client cancellation failed.");
  }

  console.log(
    `Booking lifecycle verified: requested -> confirmed -> cancelled (${requested.id}).`
  );
  } finally {
    if (createdBookingId) {
      await db
        .delete(schema.bookings)
        .where(eq(schema.bookings.id, createdBookingId));
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
