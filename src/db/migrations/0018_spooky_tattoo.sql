CREATE TABLE "marketplace_admin_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" uuid,
	"target_type" text NOT NULL,
	"target_id" uuid NOT NULL,
	"action" text NOT NULL,
	"previous_state" text,
	"new_state" text NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "marketplace_admin_actions_target_type_check" CHECK ("marketplace_admin_actions"."target_type" in ('provider_verification', 'review_report')),
	CONSTRAINT "marketplace_admin_actions_note_check" CHECK ("marketplace_admin_actions"."note" is null or length(trim("marketplace_admin_actions"."note")) <= 1200)
);
--> statement-breakpoint
ALTER TABLE "marketplace_admin_actions" ADD CONSTRAINT "marketplace_admin_actions_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "marketplace_admin_actions_target_created_idx" ON "marketplace_admin_actions" USING btree ("target_type","target_id","created_at");--> statement-breakpoint
CREATE INDEX "marketplace_admin_actions_actor_created_idx" ON "marketplace_admin_actions" USING btree ("actor_user_id","created_at");