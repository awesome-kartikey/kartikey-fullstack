// Install better-sqlite3 and create a database connection.
// Create a users table with id, email, password_hash, role.
// Write a function createUser(email, passwordHash, role).
// Write a function getUserByEmail(email) using parameterized queries.
// Add a closeDb() function and call it on process exit.
import Database from "better-sqlite3";
import { nanoid } from "nanoid";

export const db = new Database("app.db");

db.pragma("journal_mode = WAL");

// 1. Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  );
`);

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: string;
}

export function createUser(email: string, passwordHash: string, role = "user") {
  const id = nanoid();
  const statement = db.prepare(
    `INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)`,
  );

  statement.run(id, email, passwordHash, role);
  return { id, email, role };
}

export function getUserByEmail(email: string): User | undefined {
  const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
  return stmt.get(email) as User | undefined;
}


process.on("SIGINT", () => {
  console.log("Closing database...");
  db.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  console.log("Closing database...");
  db.close();
  process.exit(0);
});
