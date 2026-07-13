ALTER TABLE "opportunities" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "opportunities" ADD COLUMN "specialties" text[];--> statement-breakpoint
UPDATE "opportunities" SET "slug" = "id"::text WHERE "slug" IS NULL;--> statement-breakpoint
ALTER TABLE "opportunities" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_slug_unique" UNIQUE("slug");
