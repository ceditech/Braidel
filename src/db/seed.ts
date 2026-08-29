/* Seed script: populates dev data into Neon from the shared mock dataset.
   Safe and re-runnable: it only removes rows it created (clerk_id LIKE
   'seed_%'), which cascades through related rows without touching real users.
   Run with: npm run db:seed */
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import * as schema from "./schema";
import {
  applications,
  availabilityRules,
  bookings,
  braiders,
  braidStyles,
  clientProfiles,
  notificationPreferences,
  notifications,
  opportunities,
  portfolioMedia,
  ratings,
  salons,
  serviceOfferings,
  serviceProviders,
  users,
} from "./schema";
import { BRAID_STYLES } from "../lib/braidStyles";
import { APPLICATIONS, BRAIDERS, JOBS, SALONS } from "../lib/sampleData";

const db = drizzle(neon(process.env.DATABASE_URL!), { schema });

const PORTFOLIO_SEED_MEDIA = [
  {
    file: "knotless-box-braids.png",
    altText: "Neat waist-length knotless box braids",
    sizeBytes: 2_235_027,
  },
  {
    file: "passion-twists.png",
    altText: "Long textured passion twists",
    sizeBytes: 2_433_384,
  },
  {
    file: "feed-in-ponytail.png",
    altText: "Sculpted feed-in braided ponytail",
    sizeBytes: 2_436_875,
  },
  {
    file: "braided-bob.png",
    altText: "Precision braided bob with clean parting",
    sizeBytes: 2_167_598,
  },
] as const;

function splitName(name: string) {
  const [first, ...rest] = name.split(" ");
  return { first, last: rest.join(" ") || "-" };
}

function opportunityType(type: string) {
  const map: Record<string, "full_time" | "part_time" | "booth_rental" | "commission" | "freelance"> = {
    "Full-time": "full_time",
    "Part-time": "part_time",
    Contract: "freelance",
    "Single event": "freelance",
  };
  return map[type] ?? "freelance";
}

function applicationStatus(status: string) {
  const map: Record<string, "pending" | "reviewed" | "accepted" | "rejected"> = {
    "Under review": "pending",
    Shortlisted: "reviewed",
    Matched: "accepted",
    "Not selected": "rejected",
  };
  return map[status] ?? "pending";
}

const REVIEW_COMMENTS = [
  "Really happy with how this turned out — professional and on time.",
  "Great experience from booking to finish. Would book again.",
  "Solid work, exactly what I asked for.",
  "Friendly, skilled, and worth the price.",
  "Would recommend to anyone looking for quality braiding.",
] as const;

function reviewScoresForBadge(badge: string): number[] {
  if (badge === "Verified") return [5, 5, 5, 4, 5];
  if (badge === "Top rated") return [5, 4, 4, 5, 4];
  return [4, 4, 5, 3, 4];
}

/** Seeds real completed bookings + real reviews on those bookings, so the
 *  public rating badge (a live aggregate over `ratings`) reflects genuine
 *  data instead of a fabricated column value. Reviews are spaced a few weeks
 *  apart, oldest first. */
async function seedCompletedBookingReviews(params: {
  reviewerUserId: string;
  clientProfileId: string;
  providerId: string;
  offering: { id: string; name: string; priceCents: number; durationMinutes: number };
  target: { braiderId: string } | { salonId: string };
  scores: number[];
  timezone: string;
}) {
  const { reviewerUserId, clientProfileId, providerId, offering, target, scores, timezone } = params;

  for (let i = 0; i < scores.length; i++) {
    const startsAt = new Date(Date.now() - (scores.length - i) * 21 * 24 * 60 * 60 * 1000);
    const endsAt = new Date(startsAt.getTime() + offering.durationMinutes * 60 * 1000);

    const [booking] = await db
      .insert(bookings)
      .values({
        clientProfileId,
        providerId,
        serviceOfferingId: offering.id,
        status: "completed",
        startsAt,
        endsAt,
        timezone,
        serviceName: offering.name,
        priceCents: offering.priceCents,
        currency: "USD",
      })
      .returning();

    await db.insert(ratings).values({
      bookingId: booking.id,
      reviewerId: reviewerUserId,
      ...target,
      score: scores[i],
      comment: REVIEW_COMMENTS[i % REVIEW_COMMENTS.length],
    });
  }
}

function bookingTimezone(city: string) {
  if (city.includes("Dallas")) return "America/Chicago";
  if (city.includes("Denver")) return "America/Denver";
  if (city.includes("Los Angeles")) return "America/Los_Angeles";
  return "America/New_York";
}

async function main() {
  // Bookings use ON DELETE RESTRICT on provider_id (preserves booking history
  // even if a provider identity is later removed), so seed bookings must be
  // deleted explicitly before the cascading user cleanup below can reach
  // service_providers. Ratings/booking_status_history cascade from bookings.
  await db.execute(sql`
    DELETE FROM bookings
    WHERE provider_id IN (
      SELECT sp.id FROM service_providers sp
      LEFT JOIN braiders b ON b.id = sp.braider_id
      LEFT JOIN salons s ON s.id = sp.salon_id
      LEFT JOIN users bu ON bu.id = b.user_id
      LEFT JOIN users su ON su.id = s.owner_id
      WHERE bu.clerk_id LIKE 'seed_%' OR su.clerk_id LIKE 'seed_%'
    )
  `);
  await db.execute(sql`DELETE FROM users WHERE clerk_id LIKE 'seed_%'`);

  for (const style of BRAID_STYLES) {
    await db
      .insert(braidStyles)
      .values({
        catalogId: typeof style.id === "number" ? style.id : null,
        name: style.name,
        slug: style.slug,
        description: style.description,
        imagePrompt: style.imagePrompt,
        imagePath: style.imagePath,
        isCustom: false,
      })
      .onConflictDoUpdate({
        target: braidStyles.slug,
        set: {
          catalogId: typeof style.id === "number" ? style.id : null,
          name: style.name,
          description: style.description,
          imagePrompt: style.imagePrompt,
          imagePath: style.imagePath,
          isCustom: false,
        },
      });
  }

  const braiderIds: string[] = [];
  const salonIdsByName = new Map<string, string>();
  const opportunityIds: string[] = [];

  const [seedClient] = await db
    .insert(users)
    .values({
      clerkId: "seed_booking_client",
      role: "client",
      email: "booking-client@seed.braidel.app",
      firstName: "Maya",
      lastName: "Johnson",
      onboardedAt: new Date(),
    })
    .returning();
  const [seedClientProfile] = await db
    .insert(clientProfiles)
    .values({
      userId: seedClient.id,
      city: "Atlanta",
      state: "GA",
      timezone: "America/New_York",
    })
    .returning();
  await db.insert(notificationPreferences).values({ userId: seedClient.id });

  for (const b of BRAIDERS) {
    const { first, last } = splitName(b.name);
    const [u] = await db
      .insert(users)
      .values({
        clerkId: `seed_${b.id}`,
        role: "braider",
        email: `${b.id}@seed.braidel.app`,
        firstName: first,
        lastName: last,
        onboardedAt: new Date(),
      })
      .returning();

    const [braider] = await db
      .insert(braiders)
      .values({
        userId: u.id,
        slug: b.id,
        city: b.city,
        specialties: b.specs,
        priceRange: b.price,
        ratingAvg: b.rate,
        ratingCount: b.rev,
        isVerified: b.badge === "Verified",
        bio: `${b.city.split(",")[0]}-based braider specializing in ${b.specs[0].toLowerCase()} and protective styles.`,
        portfolioUrls: [],
      })
      .returning();

    const [bookingProvider] = await db
      .insert(serviceProviders)
      .values({
        providerType: "braider",
        braiderId: braider.id,
        timezone: bookingTimezone(b.city),
        isAcceptingBookings: true,
        maxConcurrentBookings: 1,
      })
      .returning();
    const braiderOfferings = await db
      .insert(serviceOfferings)
      .values(
        b.specs.slice(0, 2).map((specialty, index) => ({
          providerId: bookingProvider.id,
          name: `${specialty} appointment`,
          description: `A complete ${specialty.toLowerCase()} service with consultation and finishing.`,
          durationMinutes: index === 0 ? 240 : 180,
          priceCents: index === 0 ? 18000 : 14500,
          currency: "USD",
          isActive: true,
        }))
      )
      .returning();
    await db.insert(availabilityRules).values(
      [1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
        providerId: bookingProvider.id,
        dayOfWeek,
        startTime: dayOfWeek === 6 ? "10:00:00" : "09:00:00",
        endTime: dayOfWeek === 6 ? "16:00:00" : "18:00:00",
        isActive: true,
      }))
    );
    await seedCompletedBookingReviews({
      reviewerUserId: seedClient.id,
      clientProfileId: seedClientProfile.id,
      providerId: bookingProvider.id,
      offering: braiderOfferings[0],
      target: { braiderId: braider.id },
      scores: reviewScoresForBadge(b.badge),
      timezone: bookingTimezone(b.city),
    });
    await db.insert(notificationPreferences).values({ userId: u.id });
    await db.insert(notifications).values({
      userId: u.id,
      type: "system",
      title: "Welcome to your Braidel inbox",
      body: "Application, message, review, and account updates will appear here.",
      href: "/dashboard/notifications",
      eventKey: `seed-welcome:${u.id}`,
    });

    await db.insert(portfolioMedia).values(
      PORTFOLIO_SEED_MEDIA.map((media, index) => ({
        braiderId: braider.id,
        url: `/portfolio-seed/${media.file}`,
        storageKey: `seed/${b.id}/${media.file}`,
        storageProvider: "seed" as const,
        altText: `${media.altText} by ${b.name}`,
        mimeType: "image/png",
        sizeBytes: media.sizeBytes,
        sortOrder: index,
      }))
    );

    braiderIds.push(braider.id);
  }

  for (const s of SALONS) {
    const [owner] = await db
      .insert(users)
      .values({
        clerkId: `seed_salon_${s.id}`,
        role: "salon_owner",
        email: `${s.id}@seed.braidel.app`,
        firstName: s.name,
        lastName: "-",
        onboardedAt: new Date(),
      })
      .returning();

    const [salon] = await db
      .insert(salons)
      .values({
        ownerId: owner.id,
        name: s.name,
        slug: s.id,
        city: s.city,
        services: s.services,
        ratingAvg: s.rating,
        ratingCount: s.reviews,
        openRoles: s.openRoles,
        isVerified: s.verified,
        bio: `${s.name} is a braiding salon in ${s.city}.`,
      })
      .returning();

    const [bookingProvider] = await db
      .insert(serviceProviders)
      .values({
        providerType: "salon",
        salonId: salon.id,
        timezone: bookingTimezone(s.city),
        isAcceptingBookings: true,
        maxConcurrentBookings: 3,
      })
      .returning();
    const salonOfferings = await db
      .insert(serviceOfferings)
      .values(
        s.services.slice(0, 3).map((service, index) => ({
          providerId: bookingProvider.id,
          name: service,
          description: `${service} with a consultation, professional installation, and finishing at ${s.name}.`,
          durationMinutes: 180 + index * 30,
          priceCents: 15000 + index * 2500,
          currency: "USD",
          isActive: true,
        }))
      )
      .returning();
    await db.insert(availabilityRules).values(
      [1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
        providerId: bookingProvider.id,
        dayOfWeek,
        startTime: dayOfWeek === 6 ? "09:00:00" : "08:30:00",
        endTime: dayOfWeek === 6 ? "17:00:00" : "19:00:00",
        isActive: true,
      }))
    );
    await seedCompletedBookingReviews({
      reviewerUserId: seedClient.id,
      clientProfileId: seedClientProfile.id,
      providerId: bookingProvider.id,
      offering: salonOfferings[0],
      target: { salonId: salon.id },
      scores: reviewScoresForBadge(s.verified ? "Verified" : s.rating >= 4.5 ? "Top rated" : "New"),
      timezone: bookingTimezone(s.city),
    });
    await db.insert(notificationPreferences).values({ userId: owner.id });
    await db.insert(notifications).values({
      userId: owner.id,
      type: "system",
      title: "Welcome to your Braidel inbox",
      body: "Application, message, review, and account updates will appear here.",
      href: "/dashboard/notifications",
      eventKey: `seed-welcome:${owner.id}`,
    });

    salonIdsByName.set(s.name, salon.id);
  }

  for (const j of JOBS) {
    const salonId = salonIdsByName.get(j.salon);
    if (!salonId) continue;

    const [city, state] = j.city.split(",").map((part) => part.trim());
    const [opportunity] = await db
      .insert(opportunities)
      .values({
        salonId,
        slug: j.id,
        title: j.title,
        description: `${j.salon} is hiring for ${j.title.toLowerCase()} with a focus on ${j.specs.join(", ")}.`,
        type: opportunityType(j.type),
        city,
        state,
        compensation: j.pay,
        specialties: j.specs,
        isActive: true,
      })
      .returning();

    opportunityIds.push(opportunity.id);
  }

  let applicationCount = 0;
  for (let i = 0; i < APPLICATIONS.length; i++) {
    const a = APPLICATIONS[i];
    const opportunityId = opportunityIds[i % opportunityIds.length];
    const braiderId = braiderIds[i % braiderIds.length];
    if (!opportunityId || !braiderId) continue;

    await db.insert(applications).values({
      opportunityId,
      braiderId,
      status: applicationStatus(a.status),
      coverNote: `Seed application for ${a.role} at ${a.salon}.`,
    });
    applicationCount++;
  }

  console.log(
    `Seeded ${BRAID_STYLES.length} braid styles, 1 booking client, ${BRAIDERS.length} bookable braiders, ${PORTFOLIO_SEED_MEDIA.length * BRAIDERS.length} portfolio images, ${SALONS.length} bookable salons, ${opportunityIds.length} opportunities, and ${applicationCount} applications.`
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
