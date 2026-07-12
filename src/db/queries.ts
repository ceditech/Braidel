import { eq } from "drizzle-orm";
import { db } from "./index";
import { braiders, users, salons } from "./schema";

/* Shape returned to the UI — matches the fields the braider screens expect,
   so wiring a screen is just swapping the data source (see CLAUDE_HANDOFF §4). */
export interface BraiderDTO {
  id: string; // slug — used in URLs
  name: string;
  city: string;
  specs: string[];
  rate: number;
  rev: number;
  badge: "Verified" | "Top rated" | "New";
  price: string;
  tone: number;
  bio: string;
}

/** Deterministic placeholder tone per braider so list and detail colors match. */
function toneFromSlug(slug: string): number {
  let sum = 0;
  for (let i = 0; i < slug.length; i++) sum += slug.charCodeAt(i);
  return sum % 6;
}

function deriveBadge(isVerified: boolean, ratingCount: number): BraiderDTO["badge"] {
  if (isVerified) return "Verified";
  return ratingCount < 80 ? "New" : "Top rated";
}

const SELECTION = {
  slug: braiders.slug,
  city: braiders.city,
  specialties: braiders.specialties,
  ratingAvg: braiders.ratingAvg,
  ratingCount: braiders.ratingCount,
  priceRange: braiders.priceRange,
  isVerified: braiders.isVerified,
  bio: braiders.bio,
  firstName: users.firstName,
  lastName: users.lastName,
} as const;

type Row = {
  slug: string;
  city: string | null;
  specialties: string[] | null;
  ratingAvg: number | null;
  ratingCount: number;
  priceRange: string | null;
  isVerified: boolean;
  bio: string | null;
  firstName: string;
  lastName: string;
};

function mapRow(r: Row): BraiderDTO {
  return {
    id: r.slug,
    name: `${r.firstName} ${r.lastName}`.replace(/\s*—$/, "").trim(),
    city: r.city ?? "",
    specs: r.specialties ?? [],
    rate: r.ratingAvg ?? 0,
    rev: r.ratingCount,
    badge: deriveBadge(r.isVerified, r.ratingCount),
    price: r.priceRange ?? "",
    tone: toneFromSlug(r.slug),
    bio: r.bio ?? "",
  };
}

export async function getBraiders(): Promise<BraiderDTO[]> {
  const rows = await db
    .select(SELECTION)
    .from(braiders)
    .innerJoin(users, eq(braiders.userId, users.id));
  return rows.map(mapRow);
}

export async function getBraiderBySlug(slug: string): Promise<BraiderDTO | null> {
  const rows = await db
    .select(SELECTION)
    .from(braiders)
    .innerJoin(users, eq(braiders.userId, users.id))
    .where(eq(braiders.slug, slug))
    .limit(1);
  return rows.length ? mapRow(rows[0]) : null;
}

/* ── Salons ──────────────────────────────────────────────────────── */

export interface SalonDTO {
  id: string; // slug
  name: string;
  city: string;
  rating: number;
  reviews: number;
  services: string[];
  openRoles: number;
  verified: boolean;
  tone: number;
}

const SALON_SELECTION = {
  slug: salons.slug,
  name: salons.name,
  city: salons.city,
  services: salons.services,
  ratingAvg: salons.ratingAvg,
  ratingCount: salons.ratingCount,
  openRoles: salons.openRoles,
  isVerified: salons.isVerified,
} as const;

type SalonRow = {
  slug: string;
  name: string;
  city: string | null;
  services: string[] | null;
  ratingAvg: number | null;
  ratingCount: number;
  openRoles: number;
  isVerified: boolean;
};

function mapSalon(r: SalonRow): SalonDTO {
  return {
    id: r.slug,
    name: r.name,
    city: r.city ?? "",
    rating: r.ratingAvg ?? 0,
    reviews: r.ratingCount,
    services: r.services ?? [],
    openRoles: r.openRoles,
    verified: r.isVerified,
    tone: toneFromSlug(r.slug),
  };
}

export async function getSalons(): Promise<SalonDTO[]> {
  const rows = await db.select(SALON_SELECTION).from(salons);
  return rows.map(mapSalon);
}

export async function getSalonBySlug(slug: string): Promise<SalonDTO | null> {
  const rows = await db
    .select(SALON_SELECTION)
    .from(salons)
    .where(eq(salons.slug, slug))
    .limit(1);
  return rows.length ? mapSalon(rows[0]) : null;
}
