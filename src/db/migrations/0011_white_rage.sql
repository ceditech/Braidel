CREATE TYPE "public"."availability_override_type" AS ENUM('available', 'unavailable');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('requested', 'confirmed', 'declined', 'cancelled', 'completed', 'no_show');--> statement-breakpoint
CREATE TYPE "public"."service_provider_type" AS ENUM('salon', 'braider');--> statement-breakpoint
CREATE TABLE "availability_exceptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"override_type" "availability_override_type" NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "availability_exceptions_time_check" CHECK ("availability_exceptions"."starts_at" < "availability_exceptions"."ends_at")
);
--> statement-breakpoint
CREATE TABLE "availability_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" time(0) NOT NULL,
	"end_time" time(0) NOT NULL,
	"effective_from" date,
	"effective_until" date,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "availability_rules_day_check" CHECK ("availability_rules"."day_of_week" between 0 and 6),
	CONSTRAINT "availability_rules_time_check" CHECK ("availability_rules"."start_time" < "availability_rules"."end_time"),
	CONSTRAINT "availability_rules_effective_dates_check" CHECK ("availability_rules"."effective_until" is null or "availability_rules"."effective_from" is null or "availability_rules"."effective_from" <= "availability_rules"."effective_until")
);
--> statement-breakpoint
CREATE TABLE "booking_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"from_status" "booking_status",
	"to_status" "booking_status" NOT NULL,
	"changed_by_user_id" uuid,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "booking_status_history_transition_check" CHECK ("booking_status_history"."from_status" is null or "booking_status_history"."from_status" <> "booking_status_history"."to_status")
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_profile_id" uuid NOT NULL,
	"provider_id" uuid NOT NULL,
	"service_offering_id" uuid NOT NULL,
	"status" "booking_status" DEFAULT 'requested' NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"timezone" text NOT NULL,
	"service_name" text NOT NULL,
	"price_cents" integer NOT NULL,
	"currency" text NOT NULL,
	"client_note" text,
	"cancellation_reason" text,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bookings_time_check" CHECK ("bookings"."starts_at" < "bookings"."ends_at"),
	CONSTRAINT "bookings_timezone_check" CHECK (length(trim("bookings"."timezone")) > 0),
	CONSTRAINT "bookings_service_name_check" CHECK (length(trim("bookings"."service_name")) > 0),
	CONSTRAINT "bookings_price_check" CHECK ("bookings"."price_cents" >= 0),
	CONSTRAINT "bookings_currency_check" CHECK ("bookings"."currency" ~ '^[A-Z]{3}$'),
	CONSTRAINT "bookings_version_check" CHECK ("bookings"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "client_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"phone" text,
	"city" text,
	"state" text,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "client_profiles_timezone_check" CHECK (length(trim("client_profiles"."timezone")) > 0)
);
--> statement-breakpoint
CREATE TABLE "service_offerings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"braid_style_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"duration_minutes" integer NOT NULL,
	"price_cents" integer NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "service_offerings_name_check" CHECK (length(trim("service_offerings"."name")) > 0),
	CONSTRAINT "service_offerings_duration_check" CHECK ("service_offerings"."duration_minutes" > 0),
	CONSTRAINT "service_offerings_price_check" CHECK ("service_offerings"."price_cents" >= 0),
	CONSTRAINT "service_offerings_currency_check" CHECK ("service_offerings"."currency" ~ '^[A-Z]{3}$')
);
--> statement-breakpoint
CREATE TABLE "service_providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_type" "service_provider_type" NOT NULL,
	"salon_id" uuid,
	"braider_id" uuid,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"is_accepting_bookings" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "service_providers_identity_check" CHECK ((
        ("service_providers"."provider_type" = 'salon' and "service_providers"."salon_id" is not null and "service_providers"."braider_id" is null)
        or
        ("service_providers"."provider_type" = 'braider' and "service_providers"."braider_id" is not null and "service_providers"."salon_id" is null)
      )),
	CONSTRAINT "service_providers_timezone_check" CHECK (length(trim("service_providers"."timezone")) > 0)
);
--> statement-breakpoint
ALTER TABLE "availability_exceptions" ADD CONSTRAINT "availability_exceptions_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability_rules" ADD CONSTRAINT "availability_rules_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_status_history" ADD CONSTRAINT "booking_status_history_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_status_history" ADD CONSTRAINT "booking_status_history_changed_by_user_id_users_id_fk" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_client_profile_id_client_profiles_id_fk" FOREIGN KEY ("client_profile_id") REFERENCES "public"."client_profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "service_offerings_id_provider_unique" ON "service_offerings" USING btree ("id","provider_id");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_service_provider_fk" FOREIGN KEY ("service_offering_id","provider_id") REFERENCES "public"."service_offerings"("id","provider_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_profiles" ADD CONSTRAINT "client_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_offerings" ADD CONSTRAINT "service_offerings_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_offerings" ADD CONSTRAINT "service_offerings_braid_style_id_braid_styles_id_fk" FOREIGN KEY ("braid_style_id") REFERENCES "public"."braid_styles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_providers" ADD CONSTRAINT "service_providers_salon_id_salons_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_providers" ADD CONSTRAINT "service_providers_braider_id_braiders_id_fk" FOREIGN KEY ("braider_id") REFERENCES "public"."braiders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "availability_exceptions_provider_starts_idx" ON "availability_exceptions" USING btree ("provider_id","starts_at");--> statement-breakpoint
CREATE INDEX "availability_rules_provider_day_idx" ON "availability_rules" USING btree ("provider_id","day_of_week","is_active");--> statement-breakpoint
CREATE INDEX "booking_status_history_booking_created_idx" ON "booking_status_history" USING btree ("booking_id","created_at");--> statement-breakpoint
CREATE INDEX "booking_status_history_actor_idx" ON "booking_status_history" USING btree ("changed_by_user_id");--> statement-breakpoint
CREATE INDEX "bookings_client_starts_idx" ON "bookings" USING btree ("client_profile_id","starts_at");--> statement-breakpoint
CREATE INDEX "bookings_provider_status_starts_idx" ON "bookings" USING btree ("provider_id","status","starts_at");--> statement-breakpoint
CREATE UNIQUE INDEX "client_profiles_user_id_unique" ON "client_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "service_offerings_provider_active_idx" ON "service_offerings" USING btree ("provider_id","is_active");--> statement-breakpoint
CREATE INDEX "service_offerings_braid_style_idx" ON "service_offerings" USING btree ("braid_style_id");--> statement-breakpoint
CREATE UNIQUE INDEX "service_providers_salon_id_unique" ON "service_providers" USING btree ("salon_id");--> statement-breakpoint
CREATE UNIQUE INDEX "service_providers_braider_id_unique" ON "service_providers" USING btree ("braider_id");--> statement-breakpoint
INSERT INTO "client_profiles" ("user_id")
SELECT "id"
FROM "users"
WHERE "role" = 'client'
ON CONFLICT ("user_id") DO NOTHING;--> statement-breakpoint
INSERT INTO "service_providers" ("provider_type", "salon_id")
SELECT 'salon', "id"
FROM "salons"
ON CONFLICT ("salon_id") DO NOTHING;--> statement-breakpoint
INSERT INTO "service_providers" ("provider_type", "braider_id")
SELECT 'braider', "id"
FROM "braiders"
ON CONFLICT ("braider_id") DO NOTHING;
