import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }),
  fullname: text().notNull(),
  username: text().notNull().unique(),
  email: text().notNull().unique(),
  email_confirmed_at: text(),
  avatar: text(),
});
