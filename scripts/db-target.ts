/* Prints which database DATABASE_URL points at (host only, never credentials)
   and whether it is a known production host. Run with: npm run db:target
   A DATABASE_URL already set in the shell takes precedence over .env.local. */
import { config } from "dotenv";
config({ path: ".env.local" });

import { describeDatabaseTarget } from "../src/db/safety";

function main() {
  const target = describeDatabaseTarget();
  console.log(`Database host: ${target.host}`);
  if (!target.productionHostsConfigured) {
    console.log("Production host list: NOT CONFIGURED (set BRAIDEL_PRODUCTION_DB_HOSTS)");
  }
  console.log(target.isKnownProduction ? "Target: PRODUCTION" : "Target: not a known production host");
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
