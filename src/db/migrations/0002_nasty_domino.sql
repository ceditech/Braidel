ALTER TABLE "salons" ADD COLUMN "services" text[];--> statement-breakpoint
ALTER TABLE "salons" ADD COLUMN "rating_avg" real;--> statement-breakpoint
ALTER TABLE "salons" ADD COLUMN "rating_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "salons" ADD COLUMN "open_roles" integer DEFAULT 0 NOT NULL;