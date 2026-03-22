import express, { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { nanoid } from "nanoid";
import pino from "pino";
import pinoHttp from "pino-http";
import promClient from "prom-client";

const app = express();
const logger = pino({ level: process.env.LOG_LEVEL || "info" });

// Setup Metrics
promClient.collectDefaultMetrics();
const httpMetrics = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
});

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  (req as any).id = nanoid(8);
  res.setHeader("x-request-id", (req as any).id);
  next();
});
app.use(pinoHttp({ logger, genReqId: (req) => (req as any).id }));

// Track Metrics Middleware
app.use((req, res, next) => {
  const end = httpMetrics.startTimer();
  res.on("finish", () =>
    end({ method: req.method, route: req.path, status_code: res.statusCode }),
  );
  next();
});

// In-Memory DB & Zod Schemas
const tasks = new Map<string, any>();
const TaskSchema = z.object({
  title: z.string().min(1),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});
const QuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

const validate =
  (schema: z.ZodObject<any>, source: "body" | "query" = "body") =>
    (req: Request, res: Response, next: NextFunction) => {
      const result = schema.safeParse(req[source]);
      if (!result.success)
        return next({
          status: 400,
          title: "Validation Error",
          detail: result.error.issues,
        });
      req[source] = result.data;
      next();
    };

// Endpoints
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.send(await promClient.register.metrics());
});

app.get("/api/tasks", validate(QuerySchema, "query"), (req, res) => {
  const { page, limit } = req.query as any;
  const allTasks = Array.from(tasks.values());
  const paginated = allTasks.slice((page - 1) * limit, page * limit);
  res.json({ data: paginated, meta: { total: allTasks.length, page, limit } });
});

app.post("/api/tasks", validate(TaskSchema, "body"), (req, res) => {
  const id = nanoid();
  const task = { id, createdAt: new Date().toISOString(), ...req.body };
  tasks.set(id, task);
  res.status(201).json(task);
});

// RFC 7807 Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    type: err.type || "about:blank",
    title: err.title || "Internal Server Error",
    status: err.status || 500,
    detail: err.detail || err.message,
    instance: req.originalUrl,
    requestId: (req as any).id,
  });
});

app.listen(process.env.PORT || 3000, () =>
  logger.info("REST API running on port 3000"),
);
