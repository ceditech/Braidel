import "server-only";

import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@/db/schema";

neonConfig.webSocketConstructor = ws;

export type TransactionDatabase = Parameters<
  Parameters<NeonDatabase<typeof schema>["transaction"]>[0]
>[0];

export async function withBookingTransaction<T>(
  work: (tx: TransactionDatabase) => Promise<T>
): Promise<T> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const transactionDb = drizzle(pool, { schema });

  try {
    return await transactionDb.transaction(work, {
      isolationLevel: "serializable",
    });
  } finally {
    await pool.end();
  }
}

export function isRetryableBookingTransactionError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? String(error.code) : "";
  return code === "40001" || code === "40P01";
}
