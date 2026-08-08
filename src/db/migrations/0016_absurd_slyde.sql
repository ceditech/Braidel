CREATE TABLE "provider_review_response_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"response_id" uuid NOT NULL,
	"changed_by_user_id" uuid,
	"action" text NOT NULL,
	"previous_body" text,
	"new_body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "provider_review_response_history_action_check" CHECK ("provider_review_response_history"."action" in ('created', 'updated')),
	CONSTRAINT "provider_review_response_history_body_check" CHECK (length(trim("provider_review_response_history"."new_body")) between 1 and 2000)
);
--> statement-breakpoint
CREATE TABLE "provider_review_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rating_id" uuid NOT NULL,
	"provider_user_id" uuid NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "provider_review_responses_body_check" CHECK (length(trim("provider_review_responses"."body")) between 1 and 2000)
);
--> statement-breakpoint
CREATE TABLE "review_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rating_id" uuid NOT NULL,
	"reported_by_user_id" uuid NOT NULL,
	"category" text NOT NULL,
	"reason" text NOT NULL,
	"status" text DEFAULT 'submitted' NOT NULL,
	"resolution_note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "review_reports_category_check" CHECK ("review_reports"."category" in ('inaccurate', 'abusive', 'private_info', 'fraud', 'other')),
	CONSTRAINT "review_reports_status_check" CHECK ("review_reports"."status" in ('submitted', 'under_review', 'resolved', 'dismissed')),
	CONSTRAINT "review_reports_reason_check" CHECK (length(trim("review_reports"."reason")) between 10 and 2000)
);
--> statement-breakpoint
ALTER TABLE "provider_review_response_history" ADD CONSTRAINT "provider_review_response_history_response_id_provider_review_responses_id_fk" FOREIGN KEY ("response_id") REFERENCES "public"."provider_review_responses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_review_response_history" ADD CONSTRAINT "provider_review_response_history_changed_by_user_id_users_id_fk" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_review_responses" ADD CONSTRAINT "provider_review_responses_rating_id_ratings_id_fk" FOREIGN KEY ("rating_id") REFERENCES "public"."ratings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_review_responses" ADD CONSTRAINT "provider_review_responses_provider_user_id_users_id_fk" FOREIGN KEY ("provider_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_reports" ADD CONSTRAINT "review_reports_rating_id_ratings_id_fk" FOREIGN KEY ("rating_id") REFERENCES "public"."ratings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_reports" ADD CONSTRAINT "review_reports_reported_by_user_id_users_id_fk" FOREIGN KEY ("reported_by_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "provider_review_response_history_response_created_idx" ON "provider_review_response_history" USING btree ("response_id","created_at");--> statement-breakpoint
CREATE INDEX "provider_review_response_history_actor_idx" ON "provider_review_response_history" USING btree ("changed_by_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "provider_review_responses_rating_unique" ON "provider_review_responses" USING btree ("rating_id");--> statement-breakpoint
CREATE INDEX "provider_review_responses_provider_idx" ON "provider_review_responses" USING btree ("provider_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "review_reports_rating_reporter_unique" ON "review_reports" USING btree ("rating_id","reported_by_user_id");--> statement-breakpoint
CREATE INDEX "review_reports_status_created_idx" ON "review_reports" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "review_reports_reporter_idx" ON "review_reports" USING btree ("reported_by_user_id");