CREATE TYPE "public"."verification_evidence_status" AS ENUM('submitted', 'under_review', 'approved', 'rejected', 'expired');--> statement-breakpoint
CREATE TYPE "public"."verification_evidence_type" AS ENUM('identity', 'business_license', 'portfolio_proof', 'location', 'professional_credential', 'other');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('draft', 'submitted', 'under_review', 'verified', 'rejected', 'expired', 'revoked');--> statement-breakpoint
CREATE TABLE "provider_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"owner_user_id" uuid NOT NULL,
	"status" "verification_status" DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp,
	"reviewed_at" timestamp,
	"expires_at" timestamp,
	"reviewer_user_id" uuid,
	"admin_note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"verification_id" uuid NOT NULL,
	"provider_id" uuid NOT NULL,
	"submitted_by_user_id" uuid NOT NULL,
	"type" "verification_evidence_type" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"evidence_url" text,
	"status" "verification_evidence_status" DEFAULT 'submitted' NOT NULL,
	"reviewer_note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "verification_evidence_title_check" CHECK (length(trim("verification_evidence"."title")) between 3 and 140),
	CONSTRAINT "verification_evidence_description_check" CHECK ("verification_evidence"."description" is null or length(trim("verification_evidence"."description")) <= 1200),
	CONSTRAINT "verification_evidence_url_check" CHECK ("verification_evidence"."evidence_url" is null or length(trim("verification_evidence"."evidence_url")) <= 500)
);
--> statement-breakpoint
CREATE TABLE "verification_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"verification_id" uuid NOT NULL,
	"changed_by_user_id" uuid,
	"previous_status" "verification_status",
	"new_status" "verification_status" NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "verification_status_history_note_check" CHECK ("verification_status_history"."note" is null or length(trim("verification_status_history"."note")) <= 1200)
);
--> statement-breakpoint
ALTER TABLE "provider_verifications" ADD CONSTRAINT "provider_verifications_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_verifications" ADD CONSTRAINT "provider_verifications_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_verifications" ADD CONSTRAINT "provider_verifications_reviewer_user_id_users_id_fk" FOREIGN KEY ("reviewer_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_evidence" ADD CONSTRAINT "verification_evidence_verification_id_provider_verifications_id_fk" FOREIGN KEY ("verification_id") REFERENCES "public"."provider_verifications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_evidence" ADD CONSTRAINT "verification_evidence_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_evidence" ADD CONSTRAINT "verification_evidence_submitted_by_user_id_users_id_fk" FOREIGN KEY ("submitted_by_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_status_history" ADD CONSTRAINT "verification_status_history_verification_id_provider_verifications_id_fk" FOREIGN KEY ("verification_id") REFERENCES "public"."provider_verifications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_status_history" ADD CONSTRAINT "verification_status_history_changed_by_user_id_users_id_fk" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "provider_verifications_provider_unique" ON "provider_verifications" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "provider_verifications_owner_idx" ON "provider_verifications" USING btree ("owner_user_id");--> statement-breakpoint
CREATE INDEX "provider_verifications_status_updated_idx" ON "provider_verifications" USING btree ("status","updated_at");--> statement-breakpoint
CREATE INDEX "verification_evidence_verification_created_idx" ON "verification_evidence" USING btree ("verification_id","created_at");--> statement-breakpoint
CREATE INDEX "verification_evidence_provider_type_idx" ON "verification_evidence" USING btree ("provider_id","type");--> statement-breakpoint
CREATE INDEX "verification_evidence_status_idx" ON "verification_evidence" USING btree ("status");--> statement-breakpoint
CREATE INDEX "verification_status_history_verification_created_idx" ON "verification_status_history" USING btree ("verification_id","created_at");--> statement-breakpoint
CREATE INDEX "verification_status_history_actor_idx" ON "verification_status_history" USING btree ("changed_by_user_id");