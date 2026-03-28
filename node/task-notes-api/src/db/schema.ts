import { pgTable, serial, text, timestamp, boolean, integer, check, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  role: text("role").notNull().default("user"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
}, (table) => [
  check("role_check", sql`${table.role} IN ('user', 'admin')`),
]);

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull().default("medium"),
  completed: boolean("completed").notNull().default(false),
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`).notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
}, (table) => [
  check("title_length_check", sql`LENGTH(${table.title}) > 0`),
  check("priority_check", sql`${table.priority} IN ('low', 'medium', 'high')`),
]);
