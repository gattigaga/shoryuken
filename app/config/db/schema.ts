import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }),
  fullname: text().notNull(),
  username: text().notNull().unique(),
  email: text().notNull().unique(),
  email_confirmed_at: text(),
  avatar: text(),
});

export const boardsTable = sqliteTable("boards", {
  id: integer().primaryKey({ autoIncrement: true }),
  user_id: integer().notNull(),
  title: text().notNull(),
  slug: text().notNull(),
  color: text().notNull(),
  created_at: text(),
});

export const listsTable = sqliteTable("lists", {
  id: integer().primaryKey({ autoIncrement: true }),
  board_id: integer().notNull(),
  index: integer().notNull(),
  title: text().notNull(),
  created_at: text(),
});

export const cardsTable = sqliteTable("cards", {
  id: integer().primaryKey({ autoIncrement: true }),
  list_id: integer().notNull(),
  index: integer().notNull(),
  title: text().notNull(),
  description: text().default(""),
  slug: text().notNull(),
  has_checklist: integer().notNull().default(0),
  created_at: text(),
});

export const checksTable = sqliteTable("checks", {
  id: integer().primaryKey({ autoIncrement: true }),
  card_id: integer().notNull(),
  index: integer().notNull(),
  content: text().notNull(),
  is_checked: integer().notNull().default(0),
  created_at: text(),
});

export const dueDatesTable = sqliteTable("due_dates", {
  id: integer().primaryKey({ autoIncrement: true }),
  card_id: integer().notNull(),
  timestamp: text().notNull(),
  is_done: integer().notNull().default(0),
  created_at: text(),
});

export const boardMembersTable = sqliteTable("board_members", {
  id: integer().primaryKey({ autoIncrement: true }),
  board_id: integer().notNull(),
  user_id: integer().notNull(),
  created_at: text(),
});
