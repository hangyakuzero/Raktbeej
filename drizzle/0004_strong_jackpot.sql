ALTER TABLE "royaltysplits" DROP CONSTRAINT "royaltysplits_user_name_users_name_fk";
--> statement-breakpoint
ALTER TABLE "royaltysplits" DROP COLUMN "user_name";--> statement-breakpoint
ALTER TABLE "royaltysplits" DROP CONSTRAINT "split";
--> statement-breakpoint
ALTER TABLE "royaltysplits" ADD CONSTRAINT "split" PRIMARY KEY("paper_id");