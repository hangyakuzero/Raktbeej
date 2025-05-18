ALTER TABLE "royalty_splits" DROP CONSTRAINT "royalty_splits_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "royalty_splits" ADD COLUMN "user_name" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "royalty_splits" ADD CONSTRAINT "royalty_splits_user_name_users_id_fk" FOREIGN KEY ("user_name") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "royalty_splits" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "royalty_splits" DROP CONSTRAINT "split";
--> statement-breakpoint
ALTER TABLE "royalty_splits" ADD CONSTRAINT "split" PRIMARY KEY("paper_id","user_name");