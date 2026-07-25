import { and, asc, count, desc, eq, inArray, isNull, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "./index";
import {
  applications,
  braiders,
  braidStyles,
  messages,
  notificationPreferences,
  notifications,
  opportunities,
  portfolioMedia,
  ratings,
  salons,
  users,
} from "./schema";

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
  portfolio: PortfolioMediaDTO[];
}

export interface PortfolioMediaDTO {
  id: string;
  url: string;
  altText: string;
  mimeType: string;
  sizeBytes: number;
  sortOrder: number;
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
  braiderId: braiders.id,
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
  braiderId: string;
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
    portfolio: [],
  };
}

export async function getBraiders(): Promise<BraiderDTO[]> {
  const rows = await db
    .select(SELECTION)
    .from(braiders)
    .innerJoin(users, eq(braiders.userId, users.id))
    .where(isNull(users.deletedAt));
  return rows.map(mapRow);
}

export async function getBraiderBySlug(slug: string): Promise<BraiderDTO | null> {
  const rows = await db
    .select(SELECTION)
    .from(braiders)
    .innerJoin(users, eq(braiders.userId, users.id))
    .where(and(eq(braiders.slug, slug), isNull(users.deletedAt)))
    .limit(1);
  if (!rows.length) return null;

  return {
    ...mapRow(rows[0]),
    portfolio: await getPortfolioMedia(rows[0].braiderId),
  };
}

export async function getPortfolioMedia(braiderId: string): Promise<PortfolioMediaDTO[]> {
  return db
    .select({
      id: portfolioMedia.id,
      url: portfolioMedia.url,
      altText: portfolioMedia.altText,
      mimeType: portfolioMedia.mimeType,
      sizeBytes: portfolioMedia.sizeBytes,
      sortOrder: portfolioMedia.sortOrder,
    })
    .from(portfolioMedia)
    .where(eq(portfolioMedia.braiderId, braiderId))
    .orderBy(asc(portfolioMedia.sortOrder), asc(portfolioMedia.createdAt));
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
  const rows = await db
    .select(SALON_SELECTION)
    .from(salons)
    .innerJoin(users, eq(salons.ownerId, users.id))
    .where(isNull(users.deletedAt));
  return rows.map(mapSalon);
}

export async function getSalonBySlug(slug: string): Promise<SalonDTO | null> {
  const rows = await db
    .select(SALON_SELECTION)
    .from(salons)
    .innerJoin(users, eq(salons.ownerId, users.id))
    .where(and(eq(salons.slug, slug), isNull(users.deletedAt)))
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

export interface SettingsProfileDTO {
  user: {
    id: string;
    role: "salon_owner" | "braider" | "client";
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  salon: {
    name: string;
    city: string;
    bio: string;
    services: string[];
    phone: string;
    website: string;
  } | null;
  braider: {
    id: string;
    fullName: string;
    city: string;
    bio: string;
    specialties: string[];
    priceRange: string;
    yearsExperience: number | null;
    isAvailable: boolean;
    portfolio: PortfolioMediaDTO[];
  } | null;
  notificationPreferences: {
    activity: boolean;
    messages: boolean;
    weeklyDigest: boolean;
  };
}

export async function getSettingsProfile(clerkId: string): Promise<SettingsProfileDTO> {
  const userRows = await db
    .select({
      id: users.id,
      role: users.role,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
    })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!userRows.length) {
    return {
      user: null,
      salon: null,
      braider: null,
      notificationPreferences: { activity: true, messages: true, weeklyDigest: false },
    };
  }

  const user = userRows[0];
  const [salon] = await db
    .select({
      name: salons.name,
      city: salons.city,
      bio: salons.bio,
      services: salons.services,
      phone: salons.phone,
      website: salons.website,
    })
    .from(salons)
    .where(eq(salons.ownerId, user.id))
    .limit(1);

  const [braider] = await db
    .select({
      id: braiders.id,
      city: braiders.city,
      bio: braiders.bio,
      specialties: braiders.specialties,
      priceRange: braiders.priceRange,
      yearsExperience: braiders.yearsExperience,
      isAvailable: braiders.isAvailable,
    })
    .from(braiders)
    .where(eq(braiders.userId, user.id))
    .limit(1);

  const [preferences] = await db
    .select({
      activity: notificationPreferences.activity,
      messages: notificationPreferences.messages,
      weeklyDigest: notificationPreferences.weeklyDigest,
    })
    .from(notificationPreferences)
    .where(eq(notificationPreferences.userId, user.id))
    .limit(1);

  return {
    user,
    salon: salon
      ? {
          name: salon.name,
          city: salon.city ?? "",
          bio: salon.bio ?? "",
          services: salon.services ?? [],
          phone: salon.phone ?? "",
          website: salon.website ?? "",
        }
      : null,
    braider: braider
      ? {
          id: braider.id,
          fullName: `${user.firstName} ${user.lastName}`.replace(/\s*-$/, "").trim(),
          city: braider.city ?? "",
          bio: braider.bio ?? "",
          specialties: braider.specialties ?? [],
          priceRange: braider.priceRange ?? "",
          yearsExperience: braider.yearsExperience,
          isAvailable: braider.isAvailable,
          portfolio: await getPortfolioMedia(braider.id),
        }
      : null,
    notificationPreferences: preferences ?? {
      activity: true,
      messages: true,
      weeklyDigest: false,
    },
  };
}

export type NotificationType =
  | "application"
  | "application_status"
  | "message"
  | "review"
  | "portfolio"
  | "system";

export interface NotificationDTO {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  href: string | null;
  readAt: string | null;
  createdAt: string;
}

export async function getNotificationsForUser(clerkId: string): Promise<NotificationDTO[]> {
  const rows = await db
    .select({
      id: notifications.id,
      type: notifications.type,
      title: notifications.title,
      body: notifications.body,
      href: notifications.href,
      readAt: notifications.readAt,
      createdAt: notifications.createdAt,
    })
    .from(notifications)
    .innerJoin(users, eq(notifications.userId, users.id))
    .where(eq(users.clerkId, clerkId))
    .orderBy(desc(notifications.createdAt))
    .limit(100);

  return rows.map((row) => ({
    ...row,
    type: row.type as NotificationType,
    readAt: row.readAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function getUnreadNotificationCount(clerkId: string): Promise<number> {
  const [row] = await db
    .select({ total: count(notifications.id) })
    .from(notifications)
    .innerJoin(users, eq(notifications.userId, users.id))
    .where(and(eq(users.clerkId, clerkId), isNull(notifications.readAt)));

  return row?.total ?? 0;
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
  review: ReviewDTO | null;
}

export interface ReviewDTO {
  score: number;
  comment: string;
}

export interface ApplicantDTO {
  id: string;
  name: string;
  avatarUrl: string | null;
  profileSlug: string;
  city: string;
  bio: string;
  experience: string;
  yearsExperience: number | null;
  priceRange: string;
  isVerified: boolean;
  specs: string[];
  rate: number;
  rev: number;
  status: "New" | "Shortlisted" | "Matched" | "Declined";
  appliedFor: string;
  appliedAt: string;
  coverNote: string;
  portfolio: PortfolioMediaDTO[];
  review: ReviewDTO | null;
}

async function attachReviews<T extends { id: string; review: ReviewDTO | null }>(
  rows: T[],
  reviewerId: string
): Promise<T[]> {
  if (!rows.length) return rows;

  const reviewRows = await db
    .select({
      applicationId: ratings.applicationId,
      score: ratings.score,
      comment: ratings.comment,
    })
    .from(ratings)
    .where(
      and(
        eq(ratings.reviewerId, reviewerId),
        inArray(
          ratings.applicationId,
          rows.map((row) => row.id)
        )
      )
    );

  const reviewsByApplication = new Map(
    reviewRows
      .filter((review) => review.applicationId !== null)
      .map((review) => [
        review.applicationId as string,
        { score: review.score, comment: review.comment ?? "" },
      ])
  );

  return rows.map((row) => ({
    ...row,
    review: reviewsByApplication.get(row.id) ?? null,
  }));
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

type ApplicantRow = {
  id: string;
  braiderId: string;
  status: string;
  appliedFor: string;
  createdAt: Date;
  coverNote: string | null;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  profileSlug: string;
  city: string | null;
  state: string | null;
  bio: string | null;
  yearsExperience: number | null;
  priceRange: string | null;
  isVerified: boolean;
  specialties: string[] | null;
  ratingAvg: number | null;
  ratingCount: number;
};

async function mapApplicantRows(rows: ApplicantRow[]): Promise<ApplicantDTO[]> {
  if (!rows.length) return [];

  const mediaRows = await db
    .select({
      braiderId: portfolioMedia.braiderId,
      id: portfolioMedia.id,
      url: portfolioMedia.url,
      altText: portfolioMedia.altText,
      mimeType: portfolioMedia.mimeType,
      sizeBytes: portfolioMedia.sizeBytes,
      sortOrder: portfolioMedia.sortOrder,
    })
    .from(portfolioMedia)
    .where(inArray(portfolioMedia.braiderId, [...new Set(rows.map((row) => row.braiderId))]))
    .orderBy(asc(portfolioMedia.sortOrder), asc(portfolioMedia.createdAt));

  const mediaByBraider = new Map<string, PortfolioMediaDTO[]>();
  for (const media of mediaRows) {
    const current = mediaByBraider.get(media.braiderId) ?? [];
    current.push({
      id: media.id,
      url: media.url,
      altText: media.altText,
      mimeType: media.mimeType,
      sizeBytes: media.sizeBytes,
      sortOrder: media.sortOrder,
    });
    mediaByBraider.set(media.braiderId, current);
  }

  return rows.map((row) => ({
    id: row.id,
    name: `${row.firstName} ${row.lastName}`.replace(/\s*-$/, "").trim(),
    avatarUrl: row.avatarUrl,
    profileSlug: row.profileSlug,
    city: [row.city, row.state].filter(Boolean).join(", "),
    bio: row.bio ?? "",
    experience: row.yearsExperience !== null ? `${row.yearsExperience} yrs` : "Experience TBD",
    yearsExperience: row.yearsExperience,
    priceRange: row.priceRange ?? "Pricing not added",
    isVerified: row.isVerified,
    specs: row.specialties ?? [],
    rate: row.ratingAvg ?? 0,
    rev: row.ratingCount,
    status: applicantStatusLabel(row.status),
    appliedFor: row.appliedFor,
    appliedAt: `Applied ${postedLabel(row.createdAt)}`,
    coverNote: row.coverNote ?? "",
    portfolio: mediaByBraider.get(row.braiderId) ?? [],
    review: null,
  }));
}

export async function getApplicationsForBraider(clerkId: string): Promise<ApplicationDTO[]> {
  const [reviewer] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

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
    review: null,
  }));
  const visibleRows = includeDemoRows()
    ? uniqueById(mapped, await getApplications())
    : mapped;
  return reviewer ? attachReviews(visibleRows, reviewer.id) : visibleRows;
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
      braiderId: braiders.id,
      status: applications.status,
      appliedFor: opportunities.title,
      createdAt: applications.createdAt,
      coverNote: applications.coverNote,
      firstName: users.firstName,
      lastName: users.lastName,
      avatarUrl: users.avatarUrl,
      profileSlug: braiders.slug,
      city: braiders.city,
      state: braiders.state,
      bio: braiders.bio,
      yearsExperience: braiders.yearsExperience,
      priceRange: braiders.priceRange,
      isVerified: braiders.isVerified,
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

  const mapped = await mapApplicantRows(rows);
  const visibleRows = includeDemoRows()
    ? uniqueById(mapped, await getApplicants())
    : mapped;
  return attachReviews(visibleRows, ownerRows[0].id);
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
    review: null,
  }));
}

export async function getApplicants(): Promise<ApplicantDTO[]> {
  const rows = await db
    .select({
      id: applications.id,
      braiderId: braiders.id,
      status: applications.status,
      appliedFor: opportunities.title,
      createdAt: applications.createdAt,
      coverNote: applications.coverNote,
      firstName: users.firstName,
      lastName: users.lastName,
      avatarUrl: users.avatarUrl,
      profileSlug: braiders.slug,
      city: braiders.city,
      state: braiders.state,
      bio: braiders.bio,
      yearsExperience: braiders.yearsExperience,
      priceRange: braiders.priceRange,
      isVerified: braiders.isVerified,
      specialties: braiders.specialties,
      ratingAvg: braiders.ratingAvg,
      ratingCount: braiders.ratingCount,
    })
    .from(applications)
    .innerJoin(opportunities, eq(applications.opportunityId, opportunities.id))
    .innerJoin(braiders, eq(applications.braiderId, braiders.id))
    .innerJoin(users, eq(braiders.userId, users.id))
    .orderBy(desc(applications.createdAt));

  return mapApplicantRows(rows);
}

/* ─── Messages ─────────────────────────────────────────────────────────────── */

export interface MessageDTO {
  id: string;
  body: string;
  isMine: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface ConversationDTO {
  id: string; // application id
  name: string;
  avatarUrl: string | null;
  context: string;
  lastActivityAt: string;
  unread: boolean;
  messages: MessageDTO[];
}

const messageBraiderUsers = alias(users, "message_braider_users");
const messageOwnerUsers = alias(users, "message_owner_users");

export async function getConversationsForUser(clerkId: string): Promise<ConversationDTO[]> {
  const [user] = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!user || user.role === "client") return [];

  let applicationsQuery = db
    .select({
      id: applications.id,
      createdAt: applications.createdAt,
      context: opportunities.title,
      salonName: salons.name,
      salonLogoUrl: salons.logoUrl,
      ownerId: messageOwnerUsers.id,
      ownerAvatarUrl: messageOwnerUsers.avatarUrl,
      braiderUserId: messageBraiderUsers.id,
      braiderFirstName: messageBraiderUsers.firstName,
      braiderLastName: messageBraiderUsers.lastName,
      braiderAvatarUrl: messageBraiderUsers.avatarUrl,
    })
    .from(applications)
    .innerJoin(opportunities, eq(applications.opportunityId, opportunities.id))
    .innerJoin(salons, eq(opportunities.salonId, salons.id))
    .innerJoin(messageOwnerUsers, eq(salons.ownerId, messageOwnerUsers.id))
    .innerJoin(braiders, eq(applications.braiderId, braiders.id))
    .innerJoin(messageBraiderUsers, eq(braiders.userId, messageBraiderUsers.id))
    .$dynamic();

  if (!includeDemoRows()) {
    applicationsQuery = applicationsQuery.where(
      or(eq(messageOwnerUsers.id, user.id), eq(messageBraiderUsers.id, user.id))
    );
  }

  const applicationRows = await applicationsQuery.orderBy(desc(applications.createdAt));
  if (!applicationRows.length) return [];

  const applicationIds = applicationRows.map((application) => application.id);
  const messageRows = await db
    .select({
      id: messages.id,
      applicationId: messages.applicationId,
      senderId: messages.senderId,
      recipientId: messages.recipientId,
      body: messages.body,
      readAt: messages.readAt,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .where(inArray(messages.applicationId, applicationIds))
    .orderBy(asc(messages.createdAt), asc(messages.id));

  const messagesByApplication = new Map<string, MessageDTO[]>();
  const unreadApplicationIds = new Set<string>();
  for (const message of messageRows) {
    if (!message.applicationId) continue;
    const thread = messagesByApplication.get(message.applicationId) ?? [];
    thread.push({
      id: message.id,
      body: message.body,
      isMine: message.senderId === user.id,
      readAt: message.readAt?.toISOString() ?? null,
      createdAt: message.createdAt.toISOString(),
    });
    messagesByApplication.set(message.applicationId, thread);
    if (message.recipientId === user.id && message.readAt === null) {
      unreadApplicationIds.add(message.applicationId);
    }
  }

  const asBraider = user.role === "braider";
  return applicationRows
    .map((application) => {
      const thread = messagesByApplication.get(application.id) ?? [];
      const lastMessage = thread.at(-1);
      const name = asBraider
        ? application.salonName
        : `${application.braiderFirstName} ${application.braiderLastName}`.replace(/\s+-$/, "").trim();

      return {
        id: application.id,
        name,
        avatarUrl: asBraider
          ? application.salonLogoUrl ?? application.ownerAvatarUrl
          : application.braiderAvatarUrl,
        context: application.context,
        lastActivityAt: lastMessage?.createdAt ?? application.createdAt.toISOString(),
        unread: unreadApplicationIds.has(application.id),
        messages: thread,
      } satisfies ConversationDTO;
    })
    .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));
}
