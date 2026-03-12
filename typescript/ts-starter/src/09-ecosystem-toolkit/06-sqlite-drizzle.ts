import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

const sqlite = new Database(".data/app.db");
const db = drizzle(sqlite);

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  age: integer("age"),
});

// Create the users table if it doesn't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    age INTEGER
  )
`);

sqlite.exec(`DELETE FROM users`);

// insert
await db.insert(users).values({ id: "u1", name: "Ada", age: 30 });

// query
const rows = await db.select().from(users);

console.log("Users:", rows);

//Create a users table and insert/query rows via Drizzle.
