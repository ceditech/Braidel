/* Guards for scripts that write data.

   Production and development must use different Neon databases (branches).
   BRAIDEL_PRODUCTION_DB_HOSTS lists the hostnames that seed/verify scripts must
   never write to. The guard fails closed: if that list is not configured, the
   destructive scripts refuse to run.

   Deliberately free of "server-only" so plain `tsx` scripts can import it. */

export interface DatabaseTarget {
  host: string;
  isKnownProduction: boolean;
  productionHostsConfigured: boolean;
}

/** Neon pooled endpoints add "-pooler" to the endpoint id; both reach the same database. */
function normalizeHost(host: string): string {
  const [endpoint, ...rest] = host.toLowerCase().split(".");
  return [endpoint.replace(/-pooler$/, ""), ...rest].join(".");
}

function configuredProductionHosts(): string[] {
  return (process.env.BRAIDEL_PRODUCTION_DB_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean)
    .map(normalizeHost);
}

/** Describes the database `DATABASE_URL` points at, without exposing credentials. */
export function describeDatabaseTarget(url: string | undefined = process.env.DATABASE_URL): DatabaseTarget {
  if (!url) throw new Error("DATABASE_URL is not set.");

  let host: string;
  try {
    host = normalizeHost(new URL(url).hostname);
  } catch {
    throw new Error("DATABASE_URL is not a valid URL.");
  }

  const productionHosts = configuredProductionHosts();
  return {
    host,
    isKnownProduction: productionHosts.includes(host),
    productionHostsConfigured: productionHosts.length > 0,
  };
}

/** Throws unless the configured database is safe to write test/seed data to. */
export function assertNonProductionDatabase(
  action: string,
  url: string | undefined = process.env.DATABASE_URL
): void {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
    throw new Error(`${action} refused: it must not run in a production environment.`);
  }

  const target = describeDatabaseTarget(url);

  if (!target.productionHostsConfigured) {
    throw new Error(
      `${action} refused: BRAIDEL_PRODUCTION_DB_HOSTS is not set, so production cannot be recognised. ` +
        "Add the production database hostname to .env.local (see .env.example)."
    );
  }

  if (target.isKnownProduction) {
    throw new Error(
      `${action} refused: DATABASE_URL points at the production database (${target.host}). ` +
        "Point .env.local at the development branch instead."
    );
  }
}
