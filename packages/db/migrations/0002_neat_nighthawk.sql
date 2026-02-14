ALTER TABLE "invitation" ADD COLUMN "created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "metadata";--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "active_plan";