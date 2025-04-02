import {
  integer,
  boolean,
  primaryKey,
  pgTable,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  papers_uploaded: integer(),
  email: varchar({ length: 255 }).notNull().unique(),
  wallet_address: varchar(42),
  donations_recieved: integer().default(0),
});

export const papersTable = pgTable("papers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 300 }).notNull(),
  link: varchar({ length: 500 }).notNull(),
});

export const royaltySplitsTable = pgTable(
  "royalty_splits",
  {
    paper_id: integer().references(() => papersTable.id),
    user_id: integer().references(() => usersTable.id),
    wallet_address: varchar(42), // Author's wallet address
    percentage: integer().notNull(), // Royalty split percentage for the author
    is_cited_author: boolean().notNull(), // Whether this author is a cited author
  },
  (table) => [
    primaryKey({ name: "split", columns: [table.paper_id, table.user_id] }),
  ],
);
