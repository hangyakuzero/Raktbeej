CREATE TABLE "royaltysplits" (
	"paper_id" integer NOT NULL,
	"user_name" varchar(50) NOT NULL,
	"wallet_address" varchar(42),
	"percentage" integer NOT NULL,
	"is_cited_author" boolean NOT NULL,
	CONSTRAINT "split" PRIMARY KEY("paper_id","user_name")
);
--> statement-breakpoint
DROP TABLE "royalty_splits" CASCADE;--> statement-breakpoint
ALTER TABLE "royaltysplits" ADD CONSTRAINT "royaltysplits_paper_id_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."papers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "royaltysplits" ADD CONSTRAINT "royaltysplits_user_name_users_name_fk" FOREIGN KEY ("user_name") REFERENCES "public"."users"("name") ON DELETE cascade ON UPDATE no action;