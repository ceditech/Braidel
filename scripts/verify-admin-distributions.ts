import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { users, bookings } from "../src/db/schema";

const db = drizzle(neon(process.env.DATABASE_URL!), { schema });

async function main() {
  const roleRows = await db
    .select({ role: users.role, count: sql<number>`count(*)::int` })
    .from(users)
    .where(sql`${users.deletedAt} is null and ${users.accountStatus} = 'active'`)
    .groupBy(users.role);
  console.log("userRoleDistribution:", JSON.stringify(roleRows, null, 2));

  const statusRows = await db
    .select({ status: bookings.status, count: sql<number>`count(*)::int` })
    .from(bookings)
    .groupBy(bookings.status);
  console.log("bookingStatusDistribution:", JSON.stringify(statusRows, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
