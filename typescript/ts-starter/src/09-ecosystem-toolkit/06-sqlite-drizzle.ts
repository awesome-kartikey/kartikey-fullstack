import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

const db = drizzle(new Database(".data/app.db"));

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  age: integer("age"),
});

// insert
await db.insert(users).values({ id: "u1", name: "Ada", age: 30 });

// query
const rows = await db.select().from(users);

//Create a users table and insert/query rows via Drizzle.
