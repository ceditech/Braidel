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
  braiders,
  braidStyles,
  notificationPreferences,
  notifications,
  opportunities,
  portfolioMedia,
  salons,
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

async function main() {
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
    `Seeded ${BRAID_STYLES.length} braid styles, ${BRAIDERS.length} braiders, ${PORTFOLIO_SEED_MEDIA.length * BRAIDERS.length} portfolio images, ${SALONS.length} salons, ${opportunityIds.length} opportunities, and ${applicationCount} applications.`
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
