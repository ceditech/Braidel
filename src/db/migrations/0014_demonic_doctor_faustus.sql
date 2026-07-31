CREATE TABLE "rating_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rating_id" uuid NOT NULL,
	"changed_by_user_id" uuid,
	"action" text NOT NULL,
	"previous_score" integer,
	"previous_comment" text,
	"new_score" integer NOT NULL,
	"new_comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rating_history_action_check" CHECK ("rating_history"."action" in ('created', 'updated')),
	CONSTRAINT "rating_history_previous_score_check" CHECK ("rating_history"."previous_score" is null or "rating_history"."previous_score" between 1 and 5),
	CONSTRAINT "rating_history_new_score_check" CHECK ("rating_history"."new_score" between 1 and 5)
);
--> statement-breakpoint
ALTER TABLE "rating_history" ADD CONSTRAINT "rating_history_rating_id_ratings_id_fk" FOREIGN KEY ("rating_id") REFERENCES "public"."ratings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rating_history" ADD CONSTRAINT "rating_history_changed_by_user_id_users_id_fk" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "rating_history_rating_created_idx" ON "rating_history" USING btree ("rating_id","created_at");--> statement-breakpoint
CREATE INDEX "rating_history_changed_by_idx" ON "rating_history" USING btree ("changed_by_user_id");
--> statement-breakpoint
INSERT INTO "rating_history" (
	"rating_id",
	"changed_by_user_id",
	"action",
	"previous_score",
	"previous_comment",
	"new_score",
	"new_comment",
	"created_at"
)
SELECT
	"ratings"."id",
	"ratings"."reviewer_id",
	'created',
	NULL,
	NULL,
	"ratings"."score",
	"ratings"."comment",
	"ratings"."created_at"
FROM "ratings"
WHERE NOT EXISTS (
	SELECT 1
	FROM "rating_history"
	WHERE "rating_history"."rating_id" = "ratings"."id"
);
