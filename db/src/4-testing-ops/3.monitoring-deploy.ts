import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Create environment-specific database setup scripts.
// Set up database connection for containerized applications.
const dbUrl = process.env.DATABASE_URL;

const writePool = new Pool({ connectionString: dbUrl, max: 10 });

// Configure read-only connection for reporting queries.
const readPool = new Pool({
  connectionString: process.env.READ_REPLICA_URL || dbUrl,
  max: 20,
});

const app = express();

const dbMetrics = {
  queryCount: 0,
  totalQueryTimeMs: 0,
  errors: 0,
};

// Add metrics for query count, average response time.
app.use(async (req, res, next) => {
  const start = performance.now();
  res.on("finish", () => {
    dbMetrics.queryCount++;
    dbMetrics.totalQueryTimeMs += performance.now() - start;
  });

  // Set up alerts for connection pool exhaustion.
  if (writePool.waitingCount > 0) {
    console.warn(
      `Connection pool exhausted! ${writePool.waitingCount} clients waiting.`,
    );
  }
  next();
});

// Create health check that monitors connection pool status.
app.get("/admin/health/db", async (req, res) => {
  try {
    const start = performance.now();
    await writePool.query("SELECT 1");
    const pingMs = performance.now() - start;

    res.json({
      status: "healthy",
      latency_ms: pingMs.toFixed(2),
      pool_stats: {
        total_connections: writePool.totalCount,
        idle_connections: writePool.idleCount,
        waiting_clients: writePool.waitingCount,
      },
    });
  } catch (err: any) {
    dbMetrics.errors++;
    res.status(503).json({ status: "unhealthy", error: err.message });
  }
});

// Create simple dashboard for database metrics.
app.get("/admin/metrics", async (req, res) => {
  const avgResponseTime =
    dbMetrics.queryCount === 0
      ? 0
      : (dbMetrics.totalQueryTimeMs / dbMetrics.queryCount).toFixed(2);

  // Monitor database size and growth trends.
  let dbSize = "unknown";
  try {
    const sizeRes = await writePool.query(
      "SELECT pg_size_pretty(pg_database_size(current_database())) as size",
    );
    dbSize = sizeRes.rows[0].size;
  } catch (e) {
    console.error("[ERROR] Could not fetch database size.");
  }

  res.json({
    total_queries_run: dbMetrics.queryCount,
    average_query_time_ms: avgResponseTime,
    database_errors: dbMetrics.errors,
    database_size: dbSize,
    uptime_seconds: process.uptime(),
  });
});

app.get("/reports/users", async (req, res) => {
  try {
    const result = await readPool.query("SELECT 'Report Data' as data");
    res.json(result.rows);
  } catch (e) {
    res.status(500).send("Error");
  }
});

const server = app.listen(3001, () => {
  console.log("Operations Dashboard running on http://localhost:3001");
  console.log("Health endpoint: http://localhost:3001/admin/health/db");
  console.log("Metrics endpoint: http://localhost:3001/admin/metrics");

  setTimeout(() => {
    console.log("Drill complete. Shutting down server.");
    server.close();
    writePool.end();
    readPool.end();
    process.exit(0);
  }, 5000);
});
