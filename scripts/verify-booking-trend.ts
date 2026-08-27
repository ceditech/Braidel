import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { bookings } from "../src/db/schema";

const db = drizzle(neon(process.env.DATABASE_URL!), { schema });

async function main() {
  const rows = await db
    .select({
      day: sql<string>`date_trunc('day', ${bookings.createdAt})`,
      count: sql<number>`count(*)::int`,
    })
    .from(bookings)
    .where(sql`${bookings.createdAt} >= now() - interval '14 days'`)
    .groupBy(sql`date_trunc('day', ${bookings.createdAt})`)
    .orderBy(sql`date_trunc('day', ${bookings.createdAt})`);

  console.log("raw rows:", JSON.stringify(rows, null, 2));

  const countsByDay = new Map(
    rows.map((row) => [new Date(row.day).toISOString().slice(0, 10), row.count])
  );

  const trend: Array<{ date: string; count: number }> = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - i);
    const key = date.toISOString().slice(0, 10);
    trend.push({ date: key, count: countsByDay.get(key) ?? 0 });
  }

  console.log("zero-filled trend:", JSON.stringify(trend, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
