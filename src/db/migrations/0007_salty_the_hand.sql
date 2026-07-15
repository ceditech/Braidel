ALTER TABLE "ratings" ADD COLUMN "application_id" uuid;--> statement-breakpoint
ALTER TABLE "ratings" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "ratings_application_reviewer_unique" ON "ratings" USING btree ("application_id","reviewer_id");--> statement-breakpoint
CREATE INDEX "ratings_reviewer_idx" ON "ratings" USING btree ("reviewer_id");--> statement-breakpoint
CREATE INDEX "ratings_braider_idx" ON "ratings" USING btree ("braider_id");--> statement-breakpoint
CREATE INDEX "ratings_salon_idx" ON "ratings" USING btree ("salon_id");--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_score_check" CHECK ("ratings"."score" between 1 and 5);--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_single_target_check" CHECK (("ratings"."braider_id" is not null) <> ("ratings"."salon_id" is not null));--> statement-breakpoint
CREATE OR REPLACE FUNCTION refresh_rating_target_aggregate()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP <> 'INSERT' AND OLD.braider_id IS NOT NULL THEN
    UPDATE braiders
    SET
      rating_avg = aggregate.average_score,
      rating_count = aggregate.review_count,
      updated_at = now()
    FROM (
      SELECT avg(score)::real AS average_score, count(*)::integer AS review_count
      FROM ratings
      WHERE braider_id = OLD.braider_id
    ) AS aggregate
    WHERE braiders.id = OLD.braider_id;
  END IF;

  IF TG_OP <> 'INSERT' AND OLD.salon_id IS NOT NULL THEN
    UPDATE salons
    SET
      rating_avg = aggregate.average_score,
      rating_count = aggregate.review_count,
      updated_at = now()
    FROM (
      SELECT avg(score)::real AS average_score, count(*)::integer AS review_count
      FROM ratings
      WHERE salon_id = OLD.salon_id
    ) AS aggregate
    WHERE salons.id = OLD.salon_id;
  END IF;

  IF TG_OP <> 'DELETE' AND NEW.braider_id IS NOT NULL THEN
    UPDATE braiders
    SET
      rating_avg = aggregate.average_score,
      rating_count = aggregate.review_count,
      updated_at = now()
    FROM (
      SELECT avg(score)::real AS average_score, count(*)::integer AS review_count
      FROM ratings
      WHERE braider_id = NEW.braider_id
    ) AS aggregate
    WHERE braiders.id = NEW.braider_id;
  END IF;

  IF TG_OP <> 'DELETE' AND NEW.salon_id IS NOT NULL THEN
    UPDATE salons
    SET
      rating_avg = aggregate.average_score,
      rating_count = aggregate.review_count,
      updated_at = now()
    FROM (
      SELECT avg(score)::real AS average_score, count(*)::integer AS review_count
      FROM ratings
      WHERE salon_id = NEW.salon_id
    ) AS aggregate
    WHERE salons.id = NEW.salon_id;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$;--> statement-breakpoint
CREATE TRIGGER ratings_refresh_target_aggregate
AFTER INSERT OR UPDATE OR DELETE ON ratings
FOR EACH ROW
EXECUTE FUNCTION refresh_rating_target_aggregate();
