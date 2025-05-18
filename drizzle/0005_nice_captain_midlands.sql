ALTER TABLE "royaltysplits" DROP CONSTRAINT "split";--> statement-breakpoint
ALTER TABLE "royaltysplits" ALTER COLUMN "wallet_address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "royaltysplits" ADD CONSTRAINT "royaltysplits_paper_id_wallet_address_pk" PRIMARY KEY("paper_id","wallet_address");--> statement-breakpoint
ALTER TABLE "papers" ADD COLUMN "author_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "papers" ADD CONSTRAINT "papers_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_wallet_address_unique" UNIQUE("wallet_address");