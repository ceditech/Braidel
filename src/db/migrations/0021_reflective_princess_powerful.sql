CREATE TYPE "public"."account_status" AS ENUM('active', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."provider_visibility" AS ENUM('listed', 'unlisted');--> statement-breakpoint
ALTER TABLE "marketplace_admin_actions" DROP CONSTRAINT "marketplace_admin_actions_target_type_check";--> statement-breakpoint
ALTER TABLE "service_providers" ADD COLUMN "visibility" "provider_visibility" DEFAULT 'listed' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "account_status" "account_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "marketplace_admin_actions" ADD CONSTRAINT "marketplace_admin_actions_target_type_check" CHECK ("marketplace_admin_actions"."target_type" in ('provider_verification', 'review_report', 'user_account', 'provider_profile'));