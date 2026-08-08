ALTER TABLE "notifications" DROP CONSTRAINT "notifications_type_check";--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "booking_id" uuid;--> statement-breakpoint
ALTER TABLE "ratings" ADD COLUMN "booking_id" uuid;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "messages_booking_created_idx" ON "messages" USING btree ("booking_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "ratings_booking_reviewer_unique" ON "ratings" USING btree ("booking_id","reviewer_id");--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_context_check" CHECK (("messages"."application_id" is not null) <> ("messages"."booking_id" is not null));--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_type_check" CHECK ("notifications"."type" in ('application', 'application_status', 'booking', 'message', 'review', 'portfolio', 'system'));--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_context_check" CHECK (("ratings"."application_id" is not null) <> ("ratings"."booking_id" is not null));