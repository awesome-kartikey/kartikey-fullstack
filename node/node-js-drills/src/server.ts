import "dotenv/config";
import express from "express";
import http from "http";
import pg from "pg";
import pino from "pino";
import pinoHttp from "pino-http";
import { nanoid } from "nanoid";
import promClient from "prom-client";

const env = process.env.NODE_ENV || "development";
const port = parseInt(process.env.PORT || "3000", 10);

const REQUIRED_ENV = ["DATABASE_URL"];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`Fatal: Missing required environment variable ${key}`);
    process.exit(1);
  }
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const transport = pino.transport({
  targets: [
    {
      target: env === "development" ? "pino-pretty" : "pino/file",
      options: { destination: 1 } // stdout
    },
    { target: "pino/file", options: { destination: "./app.log" } }
  ]
});

export const logger = pino({ level: "info" }, transport);

promClient.collectDefaultMetrics();
const httpRequestCounter = new promClient.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"]
});

export const app = express();

app.use(pinoHttp({ logger, genReqId: () => nanoid(8) }));

app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

app.get("/healthz", (_, res) => res.status(200).json({ status: "alive" }));

app.get("/readyz", async (_, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ready" });
  } catch (err) {
    logger.error(err, "DB readiness check failed");
    res.status(503).json({ status: "unready" });
  }
});

app.get("/metrics", async (_, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.send(await promClient.register.metrics());
});

app.get("/", (_, res) => {
  setTimeout(() => res.send(`Handled by Worker PID: ${process.pid}`), 500);
});

app.get("/fib-block", (_, res) => {
  const fib = (n: number): number => (n <= 1 ? n : fib(n - 1) + fib(n - 2));
  const result = fib(40);
  res.json({ result, pid: process.pid });
});

const server = http.createServer(app);

if (env !== "test") {
  server.listen(port, () => {
    logger.info(`Server running on port ${port} | PID: ${process.pid} | ENV: ${env}`);
  });
}

const shutdown = (signal: string) => {
  logger.info(`\n[${signal}] Received. Shutting down gracefully...`);

  server.close(async (err) => {
    if (err) {
      logger.error(err, "HTTP server close error");
      process.exit(1);
    }
    logger.info("Active HTTP connections closed.");

    try {
      await pool.end();
      logger.info("DB pool disconnected.");
    } catch (dbErr) {
      logger.error(dbErr, "Error closing DB pool");
    }

    logger.info("Safe exit.");
    process.exit(0);
  });

  setTimeout(() => {
    logger.fatal("Shutdown timeout exceeded. Forcing exit.");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
