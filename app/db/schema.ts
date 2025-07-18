import {
  integer,
  primaryKey,
  pgTable,
  varchar,
} from "drizzle-orm/pg-core";

// USERS
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  wallet_address: varchar({ length: 42 }), // should be unique if used for lookup
  papers_uploaded: integer().default(0),
  donations_recieved: integer().default(0),
});

// PAPERS — link to primary author
export const papersTable = pgTable("papers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 300 }).notNull(),
  link: varchar({ length: 500 }).notNull(),
  topic: varchar({ length: 70 }).notNull(),
  author_id: integer()
    .references(() => usersTable.id, { onDelete: "set null" })
    .notNull(), // primary author
});

// ROYALTY SPLITS — for other contributors only
export const royaltySplitsTable = pgTable(
  "royaltysplits",
  {
    paper_id: integer()
      .references(() => papersTable.id, { onDelete: "cascade" })
      .notNull(),

    wallet_address: varchar({ length: 42 }).notNull(),

    percentage: integer().notNull(), // Royalty split
  },
  (table) => [primaryKey({ columns: [table.paper_id, table.wallet_address] })], // one entry per wallet per paper
);
