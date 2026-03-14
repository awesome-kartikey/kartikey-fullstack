import DatabaseConstructor, { Database } from "better-sqlite3";
import path from "path";
import fs from "fs";

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: "user" | "admin";
  created_at: string;
}

export class UserDatabase {
  private db: Database;

  constructor(dbPath: string) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    this.db = new DatabaseConstructor(dbPath);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  createUser(email: string, passwordHash: string, role: string = "user"): User {
    const stmt = this.db.prepare(
      "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)",
    );
    const info = stmt.run(email, passwordHash, role);
    return this.getUserById(info.lastInsertRowid as number)!;
  }

  getUserByEmail(email: string): User | null {
    const stmt = this.db.prepare("SELECT * FROM users WHERE email = ?");
    return (stmt.get(email) as User) || null;
  }

  getUserById(id: number): User | null {
    const stmt = this.db.prepare("SELECT * FROM users WHERE id = ?");
    return (stmt.get(id) as User) || null;
  }
  close(): void {
    // better-sqlite3 close() is synchronous
    this.db.close();
  }
}
