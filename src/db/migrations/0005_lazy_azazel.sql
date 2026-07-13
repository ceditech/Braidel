CREATE TABLE "braid_styles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"catalog_id" integer,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"image_prompt" text,
	"image_path" text,
	"is_custom" boolean DEFAULT false NOT NULL,
	"created_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "braid_styles_name_unique" UNIQUE("name"),
	CONSTRAINT "braid_styles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "braid_styles" ADD CONSTRAINT "braid_styles_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;