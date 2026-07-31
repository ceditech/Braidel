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
  date,
  time,
  foreignKey,
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

export const serviceProviderTypeEnum = pgEnum("service_provider_type", [
  "salon",
  "braider",
]);

export const availabilityOverrideTypeEnum = pgEnum(
  "availability_override_type",
  ["available", "unavailable"]
);

export const bookingStatusEnum = pgEnum("booking_status", [
  "requested",
  "confirmed",
  "declined",
  "cancelled",
  "completed",
  "no_show",
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

export const clientProfiles = pgTable(
  "client_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    phone: text("phone"),
    city: text("city"),
    state: text("state"),
    timezone: text("timezone").notNull().default("UTC"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("client_profiles_user_id_unique").on(table.userId),
    check(
      "client_profiles_timezone_check",
      sql`length(trim(${table.timezone})) > 0`
    ),
  ]
);

export const serviceProviders = pgTable(
  "service_providers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    providerType: serviceProviderTypeEnum("provider_type").notNull(),
    salonId: uuid("salon_id").references(() => salons.id, {
      onDelete: "cascade",
    }),
    braiderId: uuid("braider_id").references(() => braiders.id, {
      onDelete: "cascade",
    }),
    timezone: text("timezone").notNull().default("UTC"),
    isAcceptingBookings: boolean("is_accepting_bookings")
      .notNull()
      .default(false),
    maxConcurrentBookings: integer("max_concurrent_bookings")
      .notNull()
      .default(1),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("service_providers_salon_id_unique").on(table.salonId),
    uniqueIndex("service_providers_braider_id_unique").on(table.braiderId),
    check(
      "service_providers_identity_check",
      sql`(
        (${table.providerType} = 'salon' and ${table.salonId} is not null and ${table.braiderId} is null)
        or
        (${table.providerType} = 'braider' and ${table.braiderId} is not null and ${table.salonId} is null)
      )`
    ),
    check(
      "service_providers_timezone_check",
      sql`length(trim(${table.timezone})) > 0`
    ),
    check(
      "service_providers_capacity_check",
      sql`${table.maxConcurrentBookings} between 1 and 20`
    ),
  ]
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

// ─── Booking marketplace ─────────────────────────────────────────────────────

export const serviceOfferings = pgTable(
  "service_offerings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => serviceProviders.id, { onDelete: "cascade" }),
    braidStyleId: uuid("braid_style_id").references(() => braidStyles.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    description: text("description"),
    durationMinutes: integer("duration_minutes").notNull(),
    priceCents: integer("price_cents").notNull(),
    currency: text("currency").notNull().default("USD"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("service_offerings_id_provider_unique").on(
      table.id,
      table.providerId
    ),
    index("service_offerings_provider_active_idx").on(
      table.providerId,
      table.isActive
    ),
    index("service_offerings_braid_style_idx").on(table.braidStyleId),
    check(
      "service_offerings_name_check",
      sql`length(trim(${table.name})) > 0`
    ),
    check(
      "service_offerings_duration_check",
      sql`${table.durationMinutes} > 0`
    ),
    check("service_offerings_price_check", sql`${table.priceCents} >= 0`),
    check(
      "service_offerings_currency_check",
      sql`${table.currency} ~ '^[A-Z]{3}$'`
    ),
  ]
);

export const availabilityRules = pgTable(
  "availability_rules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => serviceProviders.id, { onDelete: "cascade" }),
    dayOfWeek: integer("day_of_week").notNull(),
    startTime: time("start_time", { precision: 0 }).notNull(),
    endTime: time("end_time", { precision: 0 }).notNull(),
    effectiveFrom: date("effective_from"),
    effectiveUntil: date("effective_until"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("availability_rules_provider_day_idx").on(
      table.providerId,
      table.dayOfWeek,
      table.isActive
    ),
    check(
      "availability_rules_day_check",
      sql`${table.dayOfWeek} between 0 and 6`
    ),
    check(
      "availability_rules_time_check",
      sql`${table.startTime} < ${table.endTime}`
    ),
    check(
      "availability_rules_effective_dates_check",
      sql`${table.effectiveUntil} is null or ${table.effectiveFrom} is null or ${table.effectiveFrom} <= ${table.effectiveUntil}`
    ),
  ]
);

export const availabilityExceptions = pgTable(
  "availability_exceptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => serviceProviders.id, { onDelete: "cascade" }),
    overrideType: availabilityOverrideTypeEnum("override_type").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("availability_exceptions_provider_starts_idx").on(
      table.providerId,
      table.startsAt
    ),
    check(
      "availability_exceptions_time_check",
      sql`${table.startsAt} < ${table.endsAt}`
    ),
  ]
);

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientProfileId: uuid("client_profile_id")
      .notNull()
      .references(() => clientProfiles.id, { onDelete: "restrict" }),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => serviceProviders.id, { onDelete: "restrict" }),
    serviceOfferingId: uuid("service_offering_id").notNull(),
    status: bookingStatusEnum("status").notNull().default("requested"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    timezone: text("timezone").notNull(),
    serviceName: text("service_name").notNull(),
    priceCents: integer("price_cents").notNull(),
    currency: text("currency").notNull(),
    clientNote: text("client_note"),
    cancellationReason: text("cancellation_reason"),
    requestKey: text("request_key"),
    version: integer("version").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    foreignKey({
      name: "bookings_service_provider_fk",
      columns: [table.serviceOfferingId, table.providerId],
      foreignColumns: [serviceOfferings.id, serviceOfferings.providerId],
    }).onDelete("restrict"),
    index("bookings_client_starts_idx").on(
      table.clientProfileId,
      table.startsAt
    ),
    index("bookings_provider_status_starts_idx").on(
      table.providerId,
      table.status,
      table.startsAt
    ),
    uniqueIndex("bookings_client_request_key_unique").on(
      table.clientProfileId,
      table.requestKey
    ),
    check("bookings_time_check", sql`${table.startsAt} < ${table.endsAt}`),
    check(
      "bookings_timezone_check",
      sql`length(trim(${table.timezone})) > 0`
    ),
    check(
      "bookings_service_name_check",
      sql`length(trim(${table.serviceName})) > 0`
    ),
    check("bookings_price_check", sql`${table.priceCents} >= 0`),
    check(
      "bookings_currency_check",
      sql`${table.currency} ~ '^[A-Z]{3}$'`
    ),
    check("bookings_version_check", sql`${table.version} > 0`),
  ]
);

export const bookingStatusHistory = pgTable(
  "booking_status_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    fromStatus: bookingStatusEnum("from_status"),
    toStatus: bookingStatusEnum("to_status").notNull(),
    changedByUserId: uuid("changed_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("booking_status_history_booking_created_idx").on(
      table.bookingId,
      table.createdAt
    ),
    index("booking_status_history_actor_idx").on(table.changedByUserId),
    check(
      "booking_status_history_transition_check",
      sql`${table.fromStatus} is null or ${table.fromStatus} <> ${table.toStatus}`
    ),
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
    bookingId: uuid("booking_id").references(() => bookings.id, {
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
    index("messages_booking_created_idx").on(table.bookingId, table.createdAt),
    index("messages_sender_idx").on(table.senderId),
    index("messages_recipient_read_idx").on(table.recipientId, table.readAt),
    check(
      "messages_context_check",
      sql`(${table.applicationId} is not null) <> (${table.bookingId} is not null)`
    ),
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
    bookingId: uuid("booking_id").references(() => bookings.id, {
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
    uniqueIndex("ratings_booking_reviewer_unique").on(
      table.bookingId,
      table.reviewerId
    ),
    index("ratings_reviewer_idx").on(table.reviewerId),
    index("ratings_braider_idx").on(table.braiderId),
    index("ratings_salon_idx").on(table.salonId),
    check("ratings_score_check", sql`${table.score} between 1 and 5`),
    check(
      "ratings_context_check",
      sql`(${table.applicationId} is not null) <> (${table.bookingId} is not null)`
    ),
    check(
      "ratings_single_target_check",
      sql`(${table.braiderId} is not null) <> (${table.salonId} is not null)`
    ),
  ]
);

export const ratingHistory = pgTable(
  "rating_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ratingId: uuid("rating_id")
      .notNull()
      .references(() => ratings.id, { onDelete: "cascade" }),
    changedByUserId: uuid("changed_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(),
    previousScore: integer("previous_score"),
    previousComment: text("previous_comment"),
    newScore: integer("new_score").notNull(),
    newComment: text("new_comment"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("rating_history_rating_created_idx").on(
      table.ratingId,
      table.createdAt
    ),
    index("rating_history_changed_by_idx").on(table.changedByUserId),
    check(
      "rating_history_action_check",
      sql`${table.action} in ('created', 'updated')`
    ),
    check(
      "rating_history_previous_score_check",
      sql`${table.previousScore} is null or ${table.previousScore} between 1 and 5`
    ),
    check(
      "rating_history_new_score_check",
      sql`${table.newScore} between 1 and 5`
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
      sql`${table.type} in ('application', 'application_status', 'booking', 'message', 'review', 'portfolio', 'system')`
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
  clientProfile: one(clientProfiles, {
    fields: [users.id],
    references: [clientProfiles.userId],
  }),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "recipient" }),
  ratingsGiven: many(ratings, { relationName: "reviewer" }),
  ratingHistoryChanges: many(ratingHistory),
  bookingStatusChanges: many(bookingStatusHistory),
  notifications: many(notifications),
  notificationPreferences: one(notificationPreferences, {
    fields: [users.id],
    references: [notificationPreferences.userId],
  }),
}));

export const salonsRelations = relations(salons, ({ one, many }) => ({
  owner: one(users, { fields: [salons.ownerId], references: [users.id] }),
  serviceProvider: one(serviceProviders, {
    fields: [salons.id],
    references: [serviceProviders.salonId],
  }),
  opportunities: many(opportunities),
  ratings: many(ratings),
}));

export const braidersRelations = relations(braiders, ({ one, many }) => ({
  user: one(users, { fields: [braiders.userId], references: [users.id] }),
  serviceProvider: one(serviceProviders, {
    fields: [braiders.id],
    references: [serviceProviders.braiderId],
  }),
  applications: many(applications),
  ratings: many(ratings),
  portfolioMedia: many(portfolioMedia),
}));

export const braidStylesRelations = relations(braidStyles, ({ many }) => ({
  serviceOfferings: many(serviceOfferings),
}));

export const clientProfilesRelations = relations(
  clientProfiles,
  ({ one, many }) => ({
    user: one(users, {
      fields: [clientProfiles.userId],
      references: [users.id],
    }),
    bookings: many(bookings),
  })
);

export const serviceProvidersRelations = relations(
  serviceProviders,
  ({ one, many }) => ({
    salon: one(salons, {
      fields: [serviceProviders.salonId],
      references: [salons.id],
    }),
    braider: one(braiders, {
      fields: [serviceProviders.braiderId],
      references: [braiders.id],
    }),
    serviceOfferings: many(serviceOfferings),
    availabilityRules: many(availabilityRules),
    availabilityExceptions: many(availabilityExceptions),
    bookings: many(bookings),
  })
);

export const serviceOfferingsRelations = relations(
  serviceOfferings,
  ({ one, many }) => ({
    provider: one(serviceProviders, {
      fields: [serviceOfferings.providerId],
      references: [serviceProviders.id],
    }),
    braidStyle: one(braidStyles, {
      fields: [serviceOfferings.braidStyleId],
      references: [braidStyles.id],
    }),
    bookings: many(bookings),
  })
);

export const availabilityRulesRelations = relations(
  availabilityRules,
  ({ one }) => ({
    provider: one(serviceProviders, {
      fields: [availabilityRules.providerId],
      references: [serviceProviders.id],
    }),
  })
);

export const availabilityExceptionsRelations = relations(
  availabilityExceptions,
  ({ one }) => ({
    provider: one(serviceProviders, {
      fields: [availabilityExceptions.providerId],
      references: [serviceProviders.id],
    }),
  })
);

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  clientProfile: one(clientProfiles, {
    fields: [bookings.clientProfileId],
    references: [clientProfiles.id],
  }),
  provider: one(serviceProviders, {
    fields: [bookings.providerId],
    references: [serviceProviders.id],
  }),
  serviceOffering: one(serviceOfferings, {
    fields: [bookings.serviceOfferingId],
    references: [serviceOfferings.id],
  }),
  statusHistory: many(bookingStatusHistory),
  messages: many(messages),
  ratings: many(ratings),
}));

export const bookingStatusHistoryRelations = relations(
  bookingStatusHistory,
  ({ one }) => ({
    booking: one(bookings, {
      fields: [bookingStatusHistory.bookingId],
      references: [bookings.id],
    }),
    changedBy: one(users, {
      fields: [bookingStatusHistory.changedByUserId],
      references: [users.id],
    }),
  })
);

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
  booking: one(bookings, {
    fields: [messages.bookingId],
    references: [bookings.id],
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

export const ratingsRelations = relations(ratings, ({ one, many }) => ({
  application: one(applications, {
    fields: [ratings.applicationId],
    references: [applications.id],
  }),
  booking: one(bookings, {
    fields: [ratings.bookingId],
    references: [bookings.id],
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
  history: many(ratingHistory),
}));

export const ratingHistoryRelations = relations(ratingHistory, ({ one }) => ({
  rating: one(ratings, {
    fields: [ratingHistory.ratingId],
    references: [ratings.id],
  }),
  changedBy: one(users, {
    fields: [ratingHistory.changedByUserId],
    references: [users.id],
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
