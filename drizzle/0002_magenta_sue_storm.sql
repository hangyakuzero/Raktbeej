ALTER TABLE "royalty_splits" DROP CONSTRAINT "royalty_splits_user_name_users_id_fk";
--> statement-breakpoint
ALTER TABLE "royalty_splits" ADD CONSTRAINT "royalty_splits_user_name_users_name_fk" FOREIGN KEY ("user_name") REFERENCES "public"."users"("name") ON DELETE cascade ON UPDATE no action;