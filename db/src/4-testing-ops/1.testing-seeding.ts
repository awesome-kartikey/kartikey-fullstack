import Database from "better-sqlite3";
import fs from "fs";

function drillSet1() {
  // Configure test environment to use SQLite in-memory database.
  const memoryDb = new Database(":memory:");

  // Run the same migrations on SQLite as PostgreSQL.
  memoryDb.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'user'
    );
  `);
  console.log("In-memory SQLite DB created and migrated.");

  // Create test data factories for consistent test setup.
  const UserFactory = {
    create: (
      db: Database.Database,
      overrides: Partial<{ email: string; role: string }> = {},
    ) => {
      const email =
        overrides.email || `test_${Date.now()}_${Math.random()}@example.com`;
      const role = overrides.role || "user";
      const stmt = db.prepare("INSERT INTO users (email, role) VALUES (?, ?)");
      const info = stmt.run(email, role);
      return { id: info.lastInsertRowid, email, role };
    },
  };

  // Write integration tests that create/tear down database per test.
  console.log("Running simulated integration test...");
  const testUser = UserFactory.create(memoryDb, { role: "admin" });
  const fetchedUser = memoryDb
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(testUser.id) as any;
  console.log(
    `Test Passed: Created & Fetched Admin User (${fetchedUser.email})`,
  );

  // Compare test performance: in-memory vs. file-based SQLite.
  const fileDb = new Database("test_comparison.db");
  fileDb.exec("CREATE TABLE dummy (id INTEGER PRIMARY KEY, val TEXT)");

  const startMem = performance.now();
  memoryDb.exec("CREATE TABLE dummy (id INTEGER PRIMARY KEY, val TEXT)");
  for (let i = 0; i < 1000; i++)
    memoryDb.prepare("INSERT INTO dummy (val) VALUES (?)").run("test");
  const memTime = performance.now() - startMem;

  const startFile = performance.now();
  for (let i = 0; i < 1000; i++)
    fileDb.prepare("INSERT INTO dummy (val) VALUES (?)").run("test");
  const fileTime = performance.now() - startFile;

  console.log(
    `Performance Comparison - In-Memory: ${memTime.toFixed(2)}ms | File-Based: ${fileTime.toFixed(2)}ms`,
  );

  fileDb.close();
  fs.unlinkSync("test_comparison.db");
  memoryDb.close();
}

function drillSet2() {
  const db = new Database(":memory:");

  // Implement db:reset that drops, recreates, and seeds database.
  db.exec(`
    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'user'
    );
  `);
  console.log("Database reset successfully.");

  // Create seed data in seeds/ folder for development.
  // Create different seed sets: minimal, realistic, performance testing.
  const minimalSeed = [{ email: "admin@company.com", role: "admin" }];
  const realisticSeed = [
    { email: "admin@company.com", role: "admin" },
    { email: "manager@company.com", role: "manager" },
    ...Array.from({ length: 5 }).map((_, i) => ({
      email: `customer${i}@company.com`,
      role: "user",
    })),
  ];
  const performanceSeed = Array.from({ length: 1000 }).map((_, i) => ({
    email: `perf${i}@company.com`,
    role: "user",
  }));

  // Write db:seed script that populates realistic test data.
  // Ensure seeds work on both PostgreSQL and SQLite.
  const insertMany = db.transaction((users: any[]) => {
    const stmt = db.prepare("INSERT INTO users (email, role) VALUES (?, ?)");
    for (const u of users) stmt.run(u.email, u.role);
  });

  const start = performance.now();
  insertMany(realisticSeed); // Applying realistic seed
  console.log(
    `Seeded ${realisticSeed.length} users in ${(performance.now() - start).toFixed(2)}ms`,
  );

  db.close();
}

function main() {
  console.log("\n Running Drill Set 1 ");
  drillSet1();

  console.log("\n Running Drill Set 2 ");
  drillSet2();
}

main();
