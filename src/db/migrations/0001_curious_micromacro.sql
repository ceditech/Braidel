ALTER TABLE "braiders" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "braiders" ADD COLUMN "price_range" text;--> statement-breakpoint
ALTER TABLE "braiders" ADD COLUMN "rating_avg" real;--> statement-breakpoint
ALTER TABLE "braiders" ADD COLUMN "rating_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "braiders" ADD CONSTRAINT "braiders_slug_unique" UNIQUE("slug");