CREATE TABLE "review_reminder_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"reminder_number" integer NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "review_reminder_events_number_check" CHECK ("review_reminder_events"."reminder_number" between 1 and 5)
);
--> statement-breakpoint
ALTER TABLE "review_reminder_events" ADD CONSTRAINT "review_reminder_events_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "review_reminder_events_booking_number_unique" ON "review_reminder_events" USING btree ("booking_id","reminder_number");--> statement-breakpoint
CREATE INDEX "review_reminder_events_booking_idx" ON "review_reminder_events" USING btree ("booking_id");