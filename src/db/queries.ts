import { and, asc, count, desc, eq } from "drizzle-orm";
import { db } from "./index";
import { applications, braiders, braidStyles, opportunities, salons, users } from "./schema";

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

export interface BraidStyleDTO {
  id: string;
  catalogId: number | null;
  name: string;
  slug: string;
  description: string;
  imagePrompt: string;
  imagePath: string;
  isCustom: boolean;
}

export async function getBraidStyles(): Promise<BraidStyleDTO[]> {
  const rows = await db
    .select({
      id: braidStyles.id,
      catalogId: braidStyles.catalogId,
      name: braidStyles.name,
      slug: braidStyles.slug,
      description: braidStyles.description,
      imagePrompt: braidStyles.imagePrompt,
      imagePath: braidStyles.imagePath,
      isCustom: braidStyles.isCustom,
    })
    .from(braidStyles)
    .orderBy(asc(braidStyles.isCustom), asc(braidStyles.catalogId), asc(braidStyles.name));

  return rows.map((row) => ({
    ...row,
    imagePrompt: row.imagePrompt ?? "",
    imagePath: row.imagePath ?? "",
  }));
}

/* ── Opportunities ───────────────────────────────────────────────────────── */

export type OpportunityStatus = "active" | "draft" | "closed";

export interface OpportunityDTO {
  id: string; // slug, used in URLs
  title: string;
  type: string;
  pay: string;
  city: string;
  state: string;
  specs: string[];
  applicants: number;
  posted: string;
  status: OpportunityStatus;
  salon: string;
  salonId: string;
  salonSlug: string;
  description: string;
}

function typeToLabel(type: string): string {
  const labels: Record<string, string> = {
    full_time: "Full-time",
    part_time: "Part-time",
    booth_rental: "Booth rental",
    commission: "Commission",
    freelance: "Single event",
  };
  return labels[type] ?? type;
}

function postedLabel(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const hours = Math.max(1, Math.floor(diffMs / 36e5));
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

type OpportunityRow = {
  slug: string;
  title: string;
  type: string;
  compensation: string | null;
  city: string | null;
  state: string | null;
  specialties: string[] | null;
  isActive: boolean;
  createdAt: Date;
  description: string;
  salonName: string;
  salonSlug: string;
  salonId: string;
  applicantCount: number;
};

function mapOpportunity(r: OpportunityRow): OpportunityDTO {
  return {
    id: r.slug,
    title: r.title,
    type: typeToLabel(r.type),
    pay: r.compensation ?? "Compensation TBD",
    city: [r.city, r.state].filter(Boolean).join(", "),
    state: r.state ?? "",
    specs: r.specialties ?? [],
    applicants: Number(r.applicantCount),
    posted: postedLabel(r.createdAt),
    status: r.isActive ? "active" : "draft",
    salon: r.salonName,
    salonId: r.salonId,
    salonSlug: r.salonSlug,
    description: r.description,
  };
}

function includeDemoRows(): boolean {
  return process.env.NODE_ENV !== "production";
}

function uniqueById<T extends { id: string }>(primary: T[], fallback: T[]): T[] {
  const seen = new Set<string>();
  const rows: T[] = [];
  for (const row of [...primary, ...fallback]) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    rows.push(row);
  }
  return rows;
}

const OPPORTUNITY_SELECTION = {
  slug: opportunities.slug,
  title: opportunities.title,
  type: opportunities.type,
  compensation: opportunities.compensation,
  city: opportunities.city,
  state: opportunities.state,
  specialties: opportunities.specialties,
  isActive: opportunities.isActive,
  createdAt: opportunities.createdAt,
  description: opportunities.description,
  salonName: salons.name,
  salonSlug: salons.slug,
  salonId: salons.id,
  applicantCount: count(applications.id),
} as const;

export async function getOpportunities(): Promise<OpportunityDTO[]> {
  const rows = await db
    .select(OPPORTUNITY_SELECTION)
    .from(opportunities)
    .innerJoin(salons, eq(opportunities.salonId, salons.id))
    .leftJoin(applications, eq(applications.opportunityId, opportunities.id))
    .groupBy(opportunities.id, salons.id)
    .orderBy(desc(opportunities.createdAt));
  return rows.map(mapOpportunity);
}

export async function getOpportunitiesForSalon(clerkId: string): Promise<OpportunityDTO[]> {
  const ownerRows = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!ownerRows.length) return getOpportunities();

  const rows = await db
    .select(OPPORTUNITY_SELECTION)
    .from(opportunities)
    .innerJoin(salons, eq(opportunities.salonId, salons.id))
    .leftJoin(applications, eq(applications.opportunityId, opportunities.id))
    .where(eq(salons.ownerId, ownerRows[0].id))
    .groupBy(opportunities.id, salons.id)
    .orderBy(desc(opportunities.createdAt));
  const mapped = rows.map(mapOpportunity);
  if (includeDemoRows()) return uniqueById(mapped, await getOpportunities());
  return mapped;
}

export async function getActiveOpportunities(): Promise<OpportunityDTO[]> {
  const rows = await db
    .select(OPPORTUNITY_SELECTION)
    .from(opportunities)
    .innerJoin(salons, eq(opportunities.salonId, salons.id))
    .leftJoin(applications, eq(applications.opportunityId, opportunities.id))
    .where(eq(opportunities.isActive, true))
    .groupBy(opportunities.id, salons.id)
    .orderBy(desc(opportunities.createdAt));
  return rows.map(mapOpportunity);
}

export async function getOpportunityBySlug(slug: string): Promise<OpportunityDTO | null> {
  const rows = await db
    .select(OPPORTUNITY_SELECTION)
    .from(opportunities)
    .innerJoin(salons, eq(opportunities.salonId, salons.id))
    .leftJoin(applications, eq(applications.opportunityId, opportunities.id))
    .where(eq(opportunities.slug, slug))
    .groupBy(opportunities.id, salons.id)
    .limit(1);
  return rows.length ? mapOpportunity(rows[0]) : null;
}

/* ── Applications ────────────────────────────────────────────────────────── */

export interface ApplicationDTO {
  id: string;
  role: string;
  salon: string;
  when: string;
  status: "Under review" | "Shortlisted" | "Matched" | "Not selected";
}

export interface ApplicantDTO {
  id: string;
  name: string;
  experience: string;
  specs: string[];
  rate: number;
  rev: number;
  status: "New" | "Shortlisted" | "Matched" | "Declined";
  appliedFor: string;
}

function applicationStatusLabel(status: string): ApplicationDTO["status"] {
  const labels: Record<string, ApplicationDTO["status"]> = {
    pending: "Under review",
    reviewed: "Shortlisted",
    accepted: "Matched",
    rejected: "Not selected",
  };
  return labels[status] ?? "Under review";
}

function applicantStatusLabel(status: string): ApplicantDTO["status"] {
  const labels: Record<string, ApplicantDTO["status"]> = {
    pending: "New",
    reviewed: "Shortlisted",
    accepted: "Matched",
    rejected: "Declined",
  };
  return labels[status] ?? "New";
}

export async function getApplicationsForBraider(clerkId: string): Promise<ApplicationDTO[]> {
  const rows = await db
    .select({
      id: applications.id,
      role: opportunities.title,
      salon: salons.name,
      status: applications.status,
      createdAt: applications.createdAt,
    })
    .from(applications)
    .innerJoin(braiders, eq(applications.braiderId, braiders.id))
    .innerJoin(users, eq(braiders.userId, users.id))
    .innerJoin(opportunities, eq(applications.opportunityId, opportunities.id))
    .innerJoin(salons, eq(opportunities.salonId, salons.id))
    .where(eq(users.clerkId, clerkId))
    .orderBy(desc(applications.createdAt));

  const mapped = rows.map((r) => ({
    id: r.id,
    role: r.role,
    salon: r.salon,
    when: `Applied ${postedLabel(r.createdAt)}`,
    status: applicationStatusLabel(r.status),
  }));
  if (includeDemoRows()) return uniqueById(mapped, await getApplications());
  return mapped;
}

export async function getApplicantsForSalon(clerkId: string): Promise<ApplicantDTO[]> {
  const ownerRows = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!ownerRows.length) return getApplicants();

  const rows = await db
    .select({
      id: applications.id,
      status: applications.status,
      appliedFor: opportunities.title,
      firstName: users.firstName,
      lastName: users.lastName,
      yearsExperience: braiders.yearsExperience,
      specialties: braiders.specialties,
      ratingAvg: braiders.ratingAvg,
      ratingCount: braiders.ratingCount,
    })
    .from(applications)
    .innerJoin(opportunities, eq(applications.opportunityId, opportunities.id))
    .innerJoin(salons, eq(opportunities.salonId, salons.id))
    .innerJoin(braiders, eq(applications.braiderId, braiders.id))
    .innerJoin(users, eq(braiders.userId, users.id))
    .where(eq(salons.ownerId, ownerRows[0].id))
    .orderBy(desc(applications.createdAt));

  const mapped = rows.map((r) => ({
    id: r.id,
    name: `${r.firstName} ${r.lastName}`.trim(),
    experience: r.yearsExperience ? `${r.yearsExperience} yrs` : "Experience TBD",
    specs: r.specialties ?? [],
    rate: r.ratingAvg ?? 0,
    rev: r.ratingCount,
    status: applicantStatusLabel(r.status),
    appliedFor: r.appliedFor,
  }));
  if (includeDemoRows()) return uniqueById(mapped, await getApplicants());
  return mapped;
}

export async function hasApplication(opportunityId: string, braiderId: string): Promise<boolean> {
  const rows = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.opportunityId, opportunityId), eq(applications.braiderId, braiderId)))
    .limit(1);
  return rows.length > 0;
}

export async function getApplications(): Promise<ApplicationDTO[]> {
  const rows = await db
    .select({
      id: applications.id,
      role: opportunities.title,
      salon: salons.name,
      status: applications.status,
      createdAt: applications.createdAt,
    })
    .from(applications)
    .innerJoin(opportunities, eq(applications.opportunityId, opportunities.id))
    .innerJoin(salons, eq(opportunities.salonId, salons.id))
    .orderBy(desc(applications.createdAt));

  return rows.map((r) => ({
    id: r.id,
    role: r.role,
    salon: r.salon,
    when: `Applied ${postedLabel(r.createdAt)}`,
    status: applicationStatusLabel(r.status),
  }));
}

export async function getApplicants(): Promise<ApplicantDTO[]> {
  const rows = await db
    .select({
      id: applications.id,
      status: applications.status,
      appliedFor: opportunities.title,
      firstName: users.firstName,
      lastName: users.lastName,
      yearsExperience: braiders.yearsExperience,
      specialties: braiders.specialties,
      ratingAvg: braiders.ratingAvg,
      ratingCount: braiders.ratingCount,
    })
    .from(applications)
    .innerJoin(opportunities, eq(applications.opportunityId, opportunities.id))
    .innerJoin(braiders, eq(applications.braiderId, braiders.id))
    .innerJoin(users, eq(braiders.userId, users.id))
    .orderBy(desc(applications.createdAt));

  return rows.map((r) => ({
    id: r.id,
    name: `${r.firstName} ${r.lastName}`.trim(),
    experience: r.yearsExperience ? `${r.yearsExperience} yrs` : "Experience TBD",
    specs: r.specialties ?? [],
    rate: r.ratingAvg ?? 0,
    rev: r.ratingCount,
    status: applicantStatusLabel(r.status),
    appliedFor: r.appliedFor,
  }));
}
