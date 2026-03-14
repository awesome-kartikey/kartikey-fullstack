import "dotenv/config";
import express from "express";
import pg from "pg";
import pino from "pino";
import pinoHttp from "pino-http";
import { nanoid } from "nanoid";
import promClient from "prom-client";
import http from "http";

//Drill 5
const REQUIRED = ["DATABASE_URL"];
for (const key of REQUIRED) {
  if (!process.env[key]) {
    console.error(`Missing ${key}`);
    process.exit(1);
  }
}
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// ----------------------------------------------------------
// Drill 1
//Replace console.log with a structured logger (e.g., pino).
const transport = pino.transport({
  targets: [
    {
      //Produce JSON logs and pretty-print in dev.
      target: process.env.NODE_ENV === "development" ? "pino-pretty" : "pino/file",
      options: { destination: 1 }
    },
    //Capture logs in a file and search by request ID.
    { target: "pino/file", options: { destination: "./app.log" } } // capture to file
  ]
});
export const logger = pino({ level: "info" }, transport);

const app = express();
//Add request IDs to every log line (middleware).
app.use(pinoHttp({ logger, genReqId: () => nanoid(8) }));

//Log at different levels: info, warn, error.
// logger.info("Server started");
// logger.warn("Rate limit approaching");
// logger.error("DB connection failed");

// ----------------------------------------------------------
//Drill 3

promClient.collectDefaultMetrics();
const httpRequestCounter = new promClient.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"]
});

app.use((req, res, next) => {
  res.on("finish", () => {
    //Confirm counters increment on each request.
    httpRequestCounter.inc({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});
//Add a /metrics endpoint that exposes Prometheus metrics.
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.send(await promClient.register.metrics());
});

// ----------------------------------------------------------
// Drill 2
// Add /healthz route that returns 200 if app is alive.
app.get("/healthz", (req, res) => res.status(200).json({ status: "alive" }));

//Add /readyz that checks DB connectivity before returning 200.
app.get("/readyz", async (req, res) => {
  try {
    await pool.query("SELECT 1"); // Check DB
    res.status(200).json({ status: "ready" });
  } catch {
    logger.error("Readiness check failed");
    //Simulate DB down → /readyz should fail.
    res.status(503).json({ status: "unready" });
  }
});

// ----------------------------------------------------------
//Drill 4
const server = http.createServer(app);
server.listen(3000, () => logger.info("Observable Server started on port 3000"));

const shutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down...`);
  server.close(async () => {
    await pool.end();
    logger.info("DB Pool closed. Exiting.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

export { app };
