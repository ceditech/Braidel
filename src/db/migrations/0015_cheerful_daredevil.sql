CREATE TYPE "public"."booking_payment_status" AS ENUM('pending', 'requires_action', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded', 'partially_refunded');--> statement-breakpoint
CREATE TYPE "public"."payment_account_status" AS ENUM('not_started', 'onboarding', 'restricted', 'active', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."payment_ledger_entry_type" AS ENUM('client_charge', 'platform_fee', 'provider_gross', 'refund', 'dispute', 'adjustment');--> statement-breakpoint
CREATE TYPE "public"."payment_webhook_status" AS ENUM('pending', 'processed', 'failed', 'ignored');--> statement-breakpoint
CREATE TABLE "booking_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"provider_payment_account_id" uuid,
	"payer_user_id" uuid,
	"status" "booking_payment_status" DEFAULT 'pending' NOT NULL,
	"collection_mode" text DEFAULT 'manual' NOT NULL,
	"capture_method" text DEFAULT 'automatic' NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" text NOT NULL,
	"application_fee_cents" integer DEFAULT 0 NOT NULL,
	"provider_gross_cents" integer NOT NULL,
	"stripe_payment_intent_id" text,
	"stripe_checkout_session_id" text,
	"stripe_charge_id" text,
	"idempotency_key" text,
	"last_error" text,
	"paid_at" timestamp with time zone,
	"refunded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "booking_payments_amount_check" CHECK ("booking_payments"."amount_cents" >= 0),
	CONSTRAINT "booking_payments_currency_check" CHECK ("booking_payments"."currency" ~ '^[A-Z]{3}$'),
	CONSTRAINT "booking_payments_fee_check" CHECK ("booking_payments"."application_fee_cents" >= 0 and "booking_payments"."application_fee_cents" <= "booking_payments"."amount_cents"),
	CONSTRAINT "booking_payments_provider_gross_check" CHECK ("booking_payments"."provider_gross_cents" >= 0 and "booking_payments"."provider_gross_cents" + "booking_payments"."application_fee_cents" = "booking_payments"."amount_cents"),
	CONSTRAINT "booking_payments_collection_mode_check" CHECK ("booking_payments"."collection_mode" in ('manual', 'booking_request', 'booking_confirmation')),
	CONSTRAINT "booking_payments_capture_method_check" CHECK ("booking_payments"."capture_method" in ('automatic', 'manual'))
);
--> statement-breakpoint
CREATE TABLE "payment_ledger_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_payment_id" uuid NOT NULL,
	"booking_id" uuid NOT NULL,
	"entry_type" "payment_ledger_entry_type" NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" text NOT NULL,
	"stripe_object_id" text,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_ledger_entries_amount_check" CHECK ("payment_ledger_entries"."amount_cents" >= 0),
	CONSTRAINT "payment_ledger_entries_currency_check" CHECK ("payment_ledger_entries"."currency" ~ '^[A-Z]{3}$')
);
--> statement-breakpoint
CREATE TABLE "payment_webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stripe_event_id" text NOT NULL,
	"event_type" text NOT NULL,
	"livemode" boolean DEFAULT false NOT NULL,
	"stripe_account_id" text,
	"api_version" text,
	"status" "payment_webhook_status" DEFAULT 'pending' NOT NULL,
	"processed_at" timestamp with time zone,
	"processing_error" text,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_webhook_events_event_type_check" CHECK (length(trim("payment_webhook_events"."event_type")) > 0)
);
--> statement-breakpoint
CREATE TABLE "provider_payment_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"stripe_account_id" text,
	"status" "payment_account_status" DEFAULT 'not_started' NOT NULL,
	"charges_enabled" boolean DEFAULT false NOT NULL,
	"payouts_enabled" boolean DEFAULT false NOT NULL,
	"details_submitted" boolean DEFAULT false NOT NULL,
	"onboarding_started_at" timestamp with time zone,
	"onboarding_completed_at" timestamp with time zone,
	"disabled_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "provider_payment_accounts_onboarding_check" CHECK ("provider_payment_accounts"."onboarding_completed_at" is null or "provider_payment_accounts"."onboarding_started_at" is null or "provider_payment_accounts"."onboarding_started_at" <= "provider_payment_accounts"."onboarding_completed_at")
);
--> statement-breakpoint
ALTER TABLE "booking_payments" ADD CONSTRAINT "booking_payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_payments" ADD CONSTRAINT "booking_payments_provider_payment_account_id_provider_payment_accounts_id_fk" FOREIGN KEY ("provider_payment_account_id") REFERENCES "public"."provider_payment_accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_payments" ADD CONSTRAINT "booking_payments_payer_user_id_users_id_fk" FOREIGN KEY ("payer_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_ledger_entries" ADD CONSTRAINT "payment_ledger_entries_booking_payment_id_booking_payments_id_fk" FOREIGN KEY ("booking_payment_id") REFERENCES "public"."booking_payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_ledger_entries" ADD CONSTRAINT "payment_ledger_entries_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_payment_accounts" ADD CONSTRAINT "provider_payment_accounts_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "booking_payments_booking_unique" ON "booking_payments" USING btree ("booking_id");--> statement-breakpoint
CREATE UNIQUE INDEX "booking_payments_intent_unique" ON "booking_payments" USING btree ("stripe_payment_intent_id");--> statement-breakpoint
CREATE UNIQUE INDEX "booking_payments_checkout_unique" ON "booking_payments" USING btree ("stripe_checkout_session_id");--> statement-breakpoint
CREATE UNIQUE INDEX "booking_payments_idempotency_unique" ON "booking_payments" USING btree ("idempotency_key");--> statement-breakpoint
CREATE INDEX "booking_payments_provider_status_idx" ON "booking_payments" USING btree ("provider_payment_account_id","status");--> statement-breakpoint
CREATE INDEX "booking_payments_payer_status_idx" ON "booking_payments" USING btree ("payer_user_id","status");--> statement-breakpoint
CREATE INDEX "payment_ledger_entries_payment_created_idx" ON "payment_ledger_entries" USING btree ("booking_payment_id","created_at");--> statement-breakpoint
CREATE INDEX "payment_ledger_entries_booking_created_idx" ON "payment_ledger_entries" USING btree ("booking_id","created_at");--> statement-breakpoint
CREATE INDEX "payment_ledger_entries_type_idx" ON "payment_ledger_entries" USING btree ("entry_type");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_webhook_events_stripe_event_unique" ON "payment_webhook_events" USING btree ("stripe_event_id");--> statement-breakpoint
CREATE INDEX "payment_webhook_events_status_received_idx" ON "payment_webhook_events" USING btree ("status","received_at");--> statement-breakpoint
CREATE INDEX "payment_webhook_events_type_idx" ON "payment_webhook_events" USING btree ("event_type");--> statement-breakpoint
CREATE UNIQUE INDEX "provider_payment_accounts_provider_unique" ON "provider_payment_accounts" USING btree ("provider_id");--> statement-breakpoint
CREATE UNIQUE INDEX "provider_payment_accounts_stripe_unique" ON "provider_payment_accounts" USING btree ("stripe_account_id");--> statement-breakpoint
CREATE INDEX "provider_payment_accounts_status_idx" ON "provider_payment_accounts" USING btree ("status");