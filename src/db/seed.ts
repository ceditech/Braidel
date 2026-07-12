/* Seed script — populates dev data into Neon from the shared mock dataset.
   Safe & re-runnable: it only removes rows it created (clerk_id LIKE 'seed_%'),
   which cascades to their braiders/salons, so the real onboarded user is never
   touched. Run with: npm run db:seed */
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import * as schema from "./schema";
import { users, braiders, salons } from "./schema";
import { BRAIDERS, SALONS } from "../lib/sampleData";

const db = drizzle(neon(process.env.DATABASE_URL!), { schema });

function splitName(name: string) {
  const [first, ...rest] = name.split(" ");
  return { first, last: rest.join(" ") || "—" };
}

async function main() {
  // Remove prior seed rows (cascades to braiders/salons via FK onDelete).
  await db.execute(sql`DELETE FROM users WHERE clerk_id LIKE 'seed_%'`);

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

    await db.insert(braiders).values({
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
    });
  }

  for (const s of SALONS) {
    const [owner] = await db
      .insert(users)
      .values({
        clerkId: `seed_salon_${s.id}`,
        role: "salon_owner",
        email: `${s.id}@seed.braidel.app`,
        firstName: s.name,
        lastName: "—",
      })
      .returning();

    await db.insert(salons).values({
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
    });
  }

  console.log(`✓ Seeded ${BRAIDERS.length} braiders and ${SALONS.length} salons.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
