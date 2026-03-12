import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { JSONFilePreset } from 'lowdb/node';

// Setup SQLite using Drizzle
export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
});

export function setupSqlite(dbPath: string) {
  const sqlite = new Database(dbPath);
  
  // Idempotent table creation
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )
  `);

  return drizzle(sqlite);
}

// Setup LowDB for local state/run summaries
type AppState = {
  lastImportDate: string | null;
  totalProcessed: number;
};

export async function getLocalState() {
  return JSONFilePreset<AppState>('data/state.json', {
    lastImportDate: null,
    totalProcessed: 0
  });
}
