ALTER TABLE "users" ADD COLUMN "onboarded_at" timestamp;
--> statement-breakpoint
UPDATE "users"
SET "onboarded_at" = COALESCE("created_at", now())
WHERE "onboarded_at" IS NULL;
