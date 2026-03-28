import Database from "better-sqlite3";

// 1. Initialize Test DB
export const testDb = new Database(":memory:");

// 2. Setup Test Schema matching Production
export function setupTestDb() {
  testDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'user'
    );
  `);
}

// 3. Data Factories
export const UserFactory = {
  build: (overrides: any = {}) => ({
    email: `test_${Math.random().toString(36).substring(7)}@example.com`,
    role: "user",
    ...overrides,
  }),

  create: (overrides: any = {}) => {
    const data = UserFactory.build(overrides);
    const stmt = testDb.prepare(
      "INSERT INTO users (email, role) VALUES (?, ?)",
    );
    const info = stmt.run(data.email, data.role);
    return { id: info.lastInsertRowid, ...data };
  },
};

// 4. Teardown helper
export function clearTestDb() {
  testDb.exec("DELETE FROM users;");
}
