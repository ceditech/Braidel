import {
  pgTable,
  text,
  timestamp,
  integer,
  pgEnum,
  uuid,
  boolean,
  real,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

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
  onboardedAt: timestamp("onboarded_at"),
  clerkUpdatedAt: timestamp("clerk_updated_at"),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Salons ───────────────────────────────────────────────────────────────────

export const braidStyles = pgTable("braid_styles", {
  id: uuid("id").primaryKey().defaultRandom(),
  catalogId: integer("catalog_id"),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  imagePrompt: text("image_prompt"),
  imagePath: text("image_path"),
  isCustom: boolean("is_custom").notNull().default(false),
  createdById: uuid("created_by_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const salons = pgTable(
  "salons",
  {
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
  },
  (table) => [uniqueIndex("salons_owner_id_unique").on(table.ownerId)]
);

// ─── Braiders ─────────────────────────────────────────────────────────────────

export const braiders = pgTable(
  "braiders",
  {
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
  },
  (table) => [uniqueIndex("braiders_user_id_unique").on(table.userId)]
);

export const portfolioMedia = pgTable(
  "portfolio_media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    braiderId: uuid("braider_id")
      .notNull()
      .references(() => braiders.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    storageKey: text("storage_key").notNull(),
    storageProvider: text("storage_provider").notNull(),
    altText: text("alt_text").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("portfolio_media_braider_order_idx").on(table.braiderId, table.sortOrder),
    uniqueIndex("portfolio_media_storage_key_unique").on(table.storageKey),
    check(
      "portfolio_media_provider_check",
      sql`${table.storageProvider} in ('local', 'vercel_blob', 'seed')`
    ),
    check("portfolio_media_size_check", sql`${table.sizeBytes} > 0`),
  ]
);

// ─── Opportunities ────────────────────────────────────────────────────────────

export const opportunities = pgTable("opportunities", {
  id: uuid("id").primaryKey().defaultRandom(),
  salonId: uuid("salon_id")
    .notNull()
    .references(() => salons.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: opportunityTypeEnum("type").notNull(),
  city: text("city"),
  state: text("state"),
  compensation: text("compensation"),
  specialties: text("specialties").array(),
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

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id").references(() => applications.id, {
      onDelete: "cascade",
    }),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    recipientId: uuid("recipient_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("messages_application_created_idx").on(table.applicationId, table.createdAt),
    index("messages_sender_idx").on(table.senderId),
    index("messages_recipient_read_idx").on(table.recipientId, table.readAt),
  ]
);

// ─── Ratings ──────────────────────────────────────────────────────────────────

export const ratings = pgTable(
  "ratings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id").references(() => applications.id, {
      onDelete: "cascade",
    }),
    reviewerId: uuid("reviewer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    braiderId: uuid("braider_id").references(() => braiders.id, {
      onDelete: "cascade",
    }),
    salonId: uuid("salon_id").references(() => salons.id, {
      onDelete: "cascade",
    }),
    score: integer("score").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("ratings_application_reviewer_unique").on(
      table.applicationId,
      table.reviewerId
    ),
    index("ratings_reviewer_idx").on(table.reviewerId),
    index("ratings_braider_idx").on(table.braiderId),
    index("ratings_salon_idx").on(table.salonId),
    check("ratings_score_check", sql`${table.score} between 1 and 5`),
    check(
      "ratings_single_target_check",
      sql`(${table.braiderId} is not null) <> (${table.salonId} is not null)`
    ),
  ]
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    href: text("href"),
    eventKey: text("event_key"),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("notifications_user_created_idx").on(table.userId, table.createdAt),
    index("notifications_user_read_idx").on(table.userId, table.readAt),
    uniqueIndex("notifications_event_key_unique").on(table.eventKey),
    check(
      "notifications_type_check",
      sql`${table.type} in ('application', 'application_status', 'message', 'review', 'portfolio', 'system')`
    ),
  ]
);

export const notificationPreferences = pgTable("notification_preferences", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  activity: boolean("activity").notNull().default(true),
  messages: boolean("messages").notNull().default(true),
  weeklyDigest: boolean("weekly_digest").notNull().default(false),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ one, many }) => ({
  salon: one(salons, { fields: [users.id], references: [salons.ownerId] }),
  braider: one(braiders, { fields: [users.id], references: [braiders.userId] }),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "recipient" }),
  ratingsGiven: many(ratings, { relationName: "reviewer" }),
  notifications: many(notifications),
  notificationPreferences: one(notificationPreferences, {
    fields: [users.id],
    references: [notificationPreferences.userId],
  }),
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
  portfolioMedia: many(portfolioMedia),
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

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  opportunity: one(opportunities, {
    fields: [applications.opportunityId],
    references: [opportunities.id],
  }),
  braider: one(braiders, {
    fields: [applications.braiderId],
    references: [braiders.id],
  }),
  messages: many(messages),
  ratings: many(ratings),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  application: one(applications, {
    fields: [messages.applicationId],
    references: [applications.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  recipient: one(users, {
    fields: [messages.recipientId],
    references: [users.id],
    relationName: "recipient",
  }),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  application: one(applications, {
    fields: [ratings.applicationId],
    references: [applications.id],
  }),
  reviewer: one(users, {
    fields: [ratings.reviewerId],
    references: [users.id],
    relationName: "reviewer",
  }),
  braider: one(braiders, {
    fields: [ratings.braiderId],
    references: [braiders.id],
  }),
  salon: one(salons, {
    fields: [ratings.salonId],
    references: [salons.id],
  }),
}));

export const portfolioMediaRelations = relations(portfolioMedia, ({ one }) => ({
  braider: one(braiders, {
    fields: [portfolioMedia.braiderId],
    references: [braiders.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const notificationPreferencesRelations = relations(
  notificationPreferences,
  ({ one }) => ({
    user: one(users, {
      fields: [notificationPreferences.userId],
      references: [users.id],
    }),
  })
);
