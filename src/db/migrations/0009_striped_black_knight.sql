ALTER TABLE "users" ADD COLUMN "clerk_updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
CREATE UNIQUE INDEX "braiders_user_id_unique" ON "braiders" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "salons_owner_id_unique" ON "salons" USING btree ("owner_id");