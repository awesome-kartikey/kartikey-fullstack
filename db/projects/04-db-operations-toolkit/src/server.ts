import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const app = express();

// Middleware to collect metrics
const metrics = { totalQueries: 0, errors: 0 };

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) metrics.totalQueries++;
  next();
});

// 1. Detailed Health Check
app.get("/admin/db-status", async (req, res) => {
  const start = performance.now();
  try {
    await pool.query("SELECT 1");
    const latency = performance.now() - start;

    res.json({
      status: "UP",
      latency_ms: parseFloat(latency.toFixed(2)),
      pool: {
        total_connections: pool.totalCount,
        idle_connections: pool.idleCount,
        waiting_clients: pool.waitingCount,
      },
    });
  } catch (err: any) {
    res.status(503).json({ status: "DOWN", error: err.message });
  }
});

// 2. Database Metrics Collection
app.get("/admin/metrics", async (req, res) => {
  try {
    // Get DB size directly from Postgres
    const sizeRes = await pool.query(
      "SELECT pg_size_pretty(pg_database_size(current_database())) as size;",
    );

    res.json({
      application_metrics: metrics,
      database_size: sizeRes.rows[0].size,
      uptime_seconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || "development",
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

// Mock API Route to test query counts
app.get("/api/users", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.json(users.rows);
  } catch (err) {
    metrics.errors++;
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`DB Operations Toolkit running on http://localhost:${PORT}`);
  console.log(`-> Health Check: http://localhost:${PORT}/admin/db-status`);
  console.log(`-> Metrics:      http://localhost:${PORT}/admin/metrics`);
});
