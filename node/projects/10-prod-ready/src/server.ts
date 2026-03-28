import express from "express";
import pino from "pino";
import pinoHttp from "pino-http";
import promClient from "prom-client";
import { Pool } from "pg";
import "dotenv/config";

const app = express();
const logger = pino({ level: process.env.LOG_LEVEL || "info" });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

promClient.collectDefaultMetrics();

app.use(pinoHttp({ logger }));

app.get("/healthz", (req, res) => res.json({ status: "alive" }));
app.get("/readyz", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ready" });
  } catch {
    res.status(503).json({ status: "unready" });
  }
});
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.send(await promClient.register.metrics());
});

const server = app.listen(process.env.PORT || 3000, () =>
  logger.info("Prod-ready app started"),
);

process.on("SIGTERM", () => {
  server.close(() => {
    pool.end();
    process.exit(0);
  });
});
