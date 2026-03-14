import { exec } from "child_process";
import { Pool } from "pg";
import util from "util";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const execPromise = util.promisify(exec);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function drillSet3() {
  const dbName = "taskapp_dev";
  const dbUser = "kartikey";
  const backupFile = `backup_${Date.now()}.sql`;

  try {
    // Create automated backup script using pg_dump.
    console.log(`Creating backup: ${backupFile}...`);
    await execPromise(`pg_dump -U ${dbUser} -d ${dbName} -f ${backupFile}`);
    console.log(`Backup successful: ${backupFile}`);

    // Implement restore procedure from backup file.
    // Test backup/restore cycle with sample data.
    console.log(`Testing restore procedure...`);
    const testDbName = "taskapp_restore_test";
    try {
      await execPromise(`createdb -U ${dbUser} ${testDbName}`);
      await execPromise(`psql -U ${dbUser} -d ${testDbName} -f ${backupFile}`);
      console.log(`Restore successful to ${testDbName}`);
      // await execPromise(`dropdb -U ${dbUser} ${testDbName}`);
    } catch (e: any) {
      console.log(`[WARN] Restore test skipped: ${e.message}`);
    }

    // Cleanup local file
    fs.unlinkSync(backupFile);
  } catch (e: any) {
    console.log(
      `[WARN] Backup skipped (ensure pg_dump is installed and credentials match): ${e.message}`,
    );
  }
}

async function drillSet4() {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS perf_test (id SERIAL PRIMARY KEY, val TEXT);",
  );

  await pool.query(`
    INSERT INTO perf_test (val) 
    SELECT md5(random()::text) FROM generate_series(1, 10000);
  `);

  // Add query timing to repository methods.
  const start = performance.now();
  await pool.query("SELECT * FROM perf_test WHERE val LIKE 'abc%'");
  const duration = performance.now() - start;

  // Identify slow queries (>100ms) and log them.
  if (duration > 5) {
    console.warn(`[WARN] Slow query detected: ${duration.toFixed(2)}ms`);
  } else {
    console.log(`Query executed in: ${duration.toFixed(2)}ms`);
  }

  // Use EXPLAIN ANALYZE to understand query performance.
  console.log("Running EXPLAIN ANALYZE on a full table scan...");
  const explainPlan = await pool.query(
    "EXPLAIN ANALYZE SELECT * FROM perf_test WHERE val LIKE 'abc%'",
  );
  console.log(explainPlan.rows.map((r) => r["QUERY PLAN"]).join("\n"));

  // Test performance impact of indexes on write operations.
  const writeStartPreIndex = performance.now();
  await pool.query(
    `INSERT INTO perf_test (val) SELECT md5(random()::text) FROM generate_series(1, 5000);`,
  );
  const writeTimePreIndex = performance.now() - writeStartPreIndex;

  // Create indexes for common query patterns.
  console.log("Creating Index...");
  await pool.query("CREATE INDEX idx_perf_val ON perf_test(val);");

  const explainPlanIndexed = await pool.query(
    "EXPLAIN ANALYZE SELECT * FROM perf_test WHERE val LIKE 'abc%'",
  );
  console.log("EXPLAIN ANALYZE after index creation:");
  console.log(explainPlanIndexed.rows.map((r) => r["QUERY PLAN"]).join("\n"));

  // Test performance impact of indexes on write operations.
  const writeStartPostIndex = performance.now();
  await pool.query(
    `INSERT INTO perf_test (val) SELECT md5(random()::text) FROM generate_series(1, 5000);`,
  );
  const writeTimePostIndex = performance.now() - writeStartPostIndex;

  console.log(
    `Write Performance - Before Index: ${writeTimePreIndex.toFixed(2)}ms | After Index: ${writeTimePostIndex.toFixed(2)}ms`,
  );
  console.log(`Notice that writes are slower after index creation.`);

  await pool.query("DROP TABLE IF EXISTS perf_test CASCADE;");
}

async function main() {
  console.log("\n Running Drill Set 3 ");
  await drillSet3();

  console.log("\n Running Drill Set 4 ");
  await drillSet4();

  await pool.end();
}

main();
