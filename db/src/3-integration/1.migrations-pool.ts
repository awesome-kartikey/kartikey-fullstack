import { Pool } from "pg";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Create a database module with connection pool configuration.
// Set up connection limits, timeouts, and retry logic.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Handle connection failures gracefully with fallback behavior.
pool.on("error", (err) => {
  console.error("[ERROR] Unexpected error exiting...", err);
});

async function drillSet1() {
  const client = await pool.connect();
  try {
    // Create a migrations table to track applied migrations.
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create migrations/ folder with numbered SQL files: 001_initial_schema.sql, 002_add_categories.sql.
    // Write a migration runner that applies only new migrations.
    const migrationsDir = path.join(process.cwd(), "migrations");
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter((f) => f.endsWith(".sql")).sort();

    for (const file of sqlFiles) {
      const checkRes = await client.query(
        "SELECT id FROM schema_migrations WHERE filename = $1",
        [file],
      );

      if (checkRes.rowCount === 0) {
        console.log(`Applying migration: ${file}`);
        const filePath = path.join(migrationsDir, file);
        const sql = await fs.readFile(filePath, "utf-8");

        await client.query("BEGIN");
        try {
          if (sql.trim()) {
            await client.query(sql);
          }
          await client.query(
            "INSERT INTO schema_migrations (filename) VALUES ($1)",
            [file],
          );
          await client.query("COMMIT");
        } catch (err) {
          await client.query("ROLLBACK");
          console.error(`[ERROR] Failed migration ${file}`, err);
          throw err;
        }
      }
    }

    // Test: run migrations multiple times, ensure idempotency.
    console.log("Migration runner completed.");

    // Add rollback capability for development.
    async function rollbackLastMigration() {
      const lastRes = await client.query(
        "SELECT filename FROM schema_migrations ORDER BY id DESC LIMIT 1",
      );
      if (lastRes.rowCount && lastRes.rowCount > 0) {
        const lastMigration = lastRes.rows[0].filename;
        console.log(`Rolling back migration: ${lastMigration}`);
        await client.query(
          "DELETE FROM schema_migrations WHERE filename = $1",
          [lastMigration],
        );
      }
    }
    // await rollbackLastMigration(); // rollback
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.log("/migrations folder not found");
    } else {
      throw error;
    }
  } finally {
    client.release();
  }
}

async function drillSet2() {
  // Implement health check endpoint that verifies database connectivity.
  async function performHealthCheck() {
    try {
      const res = await pool.query("SELECT 1");
      if (res.rowCount && res.rowCount > 0) {
        console.log("Health check passed: Database connectivity confirmed.");
      }
    } catch (err) {
      console.error("[ERROR] Health check failed:", err);
    }
  }

  await performHealthCheck();
}

async function main() {
  console.log("\n Running Drill Set 1 ");
  await drillSet1();

  console.log("\n Running Drill Set 2 ");
  await drillSet2();

  console.log("Closing database connections.");
  await pool.end();
}

main();
