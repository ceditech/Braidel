ALTER TABLE "bookings" ADD COLUMN "request_key" text;--> statement-breakpoint
ALTER TABLE "service_providers" ADD COLUMN "max_concurrent_bookings" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "bookings_client_request_key_unique" ON "bookings" USING btree ("client_profile_id","request_key");--> statement-breakpoint
ALTER TABLE "service_providers" ADD CONSTRAINT "service_providers_capacity_check" CHECK ("service_providers"."max_concurrent_bookings" between 1 and 20);