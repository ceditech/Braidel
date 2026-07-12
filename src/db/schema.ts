import {
  pgTable,
  text,
  timestamp,
  integer,
  pgEnum,
  uuid,
  boolean,
  decimal,
  real,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", [
  "salon_owner",
  "braider",
  "client",
]);

export const opportunityTypeEnum = pgEnum("opportunity_type", [
  "full_time",
  "part_time",
  "booth_rental",
  "commission",
  "freelance",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "reviewed",
  "accepted",
  "rejected",
]);

// ─── Users ────────────────────────────────────────────────────────────────────
// clerk_id links this row to the Clerk user record (source of truth for auth)

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  role: userRoleEnum("role").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Salons ───────────────────────────────────────────────────────────────────

export const salons = pgTable("salons", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  bio: text("bio"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
  phone: text("phone"),
  website: text("website"),
  logoUrl: text("logo_url"),
  services: text("services").array(),
  ratingAvg: real("rating_avg"),
  ratingCount: integer("rating_count").notNull().default(0),
  openRoles: integer("open_roles").notNull().default(0),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Braiders ─────────────────────────────────────────────────────────────────

export const braiders = pgTable("braiders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  bio: text("bio"),
  city: text("city"),
  state: text("state"),
  yearsExperience: integer("years_experience"),
  specialties: text("specialties").array(),
  priceRange: text("price_range"),
  ratingAvg: real("rating_avg"),
  ratingCount: integer("rating_count").notNull().default(0),
  isAvailable: boolean("is_available").notNull().default(true),
  isVerified: boolean("is_verified").notNull().default(false),
  portfolioUrls: text("portfolio_urls").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Opportunities ────────────────────────────────────────────────────────────

export const opportunities = pgTable("opportunities", {
  id: uuid("id").primaryKey().defaultRandom(),
  salonId: uuid("salon_id")
    .notNull()
    .references(() => salons.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: opportunityTypeEnum("type").notNull(),
  city: text("city"),
  state: text("state"),
  compensation: text("compensation"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Applications ─────────────────────────────────────────────────────────────

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  opportunityId: uuid("opportunity_id")
    .notNull()
    .references(() => opportunities.id, { onDelete: "cascade" }),
  braiderId: uuid("braider_id")
    .notNull()
    .references(() => braiders.id, { onDelete: "cascade" }),
  coverNote: text("cover_note"),
  status: applicationStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Messages ─────────────────────────────────────────────────────────────────

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  recipientId: uuid("recipient_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Ratings ──────────────────────────────────────────────────────────────────

export const ratings = pgTable("ratings", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewerId: uuid("reviewer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  braiderId: uuid("braider_id").references(() => braiders.id, {
    onDelete: "cascade",
  }),
  salonId: uuid("salon_id").references(() => salons.id, {
    onDelete: "cascade",
  }),
  score: integer("score").notNull(), // 1–5
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ one, many }) => ({
  salon: one(salons, { fields: [users.id], references: [salons.ownerId] }),
  braider: one(braiders, { fields: [users.id], references: [braiders.userId] }),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "recipient" }),
  ratingsGiven: many(ratings, { relationName: "reviewer" }),
}));

export const salonsRelations = relations(salons, ({ one, many }) => ({
  owner: one(users, { fields: [salons.ownerId], references: [users.id] }),
  opportunities: many(opportunities),
  ratings: many(ratings),
}));

export const braidersRelations = relations(braiders, ({ one, many }) => ({
  user: one(users, { fields: [braiders.userId], references: [users.id] }),
  applications: many(applications),
  ratings: many(ratings),
}));

export const opportunitiesRelations = relations(
  opportunities,
  ({ one, many }) => ({
    salon: one(salons, {
      fields: [opportunities.salonId],
      references: [salons.id],
    }),
    applications: many(applications),
  })
);

export const applicationsRelations = relations(applications, ({ one }) => ({
  opportunity: one(opportunities, {
    fields: [applications.opportunityId],
    references: [opportunities.id],
  }),
  braider: one(braiders, {
    fields: [applications.braiderId],
    references: [braiders.id],
  }),
}));
