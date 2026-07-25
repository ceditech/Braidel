CREATE TABLE "notification_preferences" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"activity" boolean DEFAULT true NOT NULL,
	"messages" boolean DEFAULT true NOT NULL,
	"weekly_digest" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"href" text,
	"event_key" text,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notifications_type_check" CHECK ("notifications"."type" in ('application', 'application_status', 'message', 'review', 'portfolio', 'system'))
);
--> statement-breakpoint
CREATE TABLE "portfolio_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"braider_id" uuid NOT NULL,
	"url" text NOT NULL,
	"storage_key" text NOT NULL,
	"storage_provider" text NOT NULL,
	"alt_text" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_media_provider_check" CHECK ("portfolio_media"."storage_provider" in ('local', 'vercel_blob', 'seed')),
	CONSTRAINT "portfolio_media_size_check" CHECK ("portfolio_media"."size_bytes" > 0)
);
--> statement-breakpoint
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_media" ADD CONSTRAINT "portfolio_media_braider_id_braiders_id_fk" FOREIGN KEY ("braider_id") REFERENCES "public"."braiders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notifications_user_created_idx" ON "notifications" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "notifications_user_read_idx" ON "notifications" USING btree ("user_id","read_at");--> statement-breakpoint
CREATE UNIQUE INDEX "notifications_event_key_unique" ON "notifications" USING btree ("event_key");--> statement-breakpoint
CREATE INDEX "portfolio_media_braider_order_idx" ON "portfolio_media" USING btree ("braider_id","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "portfolio_media_storage_key_unique" ON "portfolio_media" USING btree ("storage_key");--> statement-breakpoint
INSERT INTO "notification_preferences" ("user_id")
SELECT "id" FROM "users"
ON CONFLICT ("user_id") DO NOTHING;--> statement-breakpoint
INSERT INTO "notifications" ("user_id", "type", "title", "body", "href", "event_key")
SELECT
	"id",
	'system',
	'Notification center is ready',
	'Application, message, review, and account updates now appear in one place.',
	'/dashboard/notifications',
	'notification-center-launch:' || "id"::text
FROM "users"
ON CONFLICT ("event_key") DO NOTHING;
