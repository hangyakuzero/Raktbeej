CREATE TABLE "papers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "papers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(300) NOT NULL,
	"link" varchar(500) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "royalty_splits" (
	"paper_id" integer,
	"user_id" integer,
	"wallet_address" varchar,
	"percentage" integer NOT NULL,
	"is_cited_author" boolean NOT NULL,
	CONSTRAINT "split" PRIMARY KEY("paper_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"papers_uploaded" integer,
	"email" varchar(255) NOT NULL,
	"wallet_address" varchar,
	"donations_recieved" integer DEFAULT 0,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "royalty_splits" ADD CONSTRAINT "royalty_splits_paper_id_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."papers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "royalty_splits" ADD CONSTRAINT "royalty_splits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;