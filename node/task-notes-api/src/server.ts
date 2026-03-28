import express from "express";
import { nanoid } from "nanoid";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { pinoHttp } from "pino-http";
import { config } from "./config.js";
import logger from "./logger.js";
import { errorHandler, notFound } from "./errors.js";
import { metricsMiddleware, register } from "./metrics.js";
import { checkDb } from "./database.js";
import { AuthService } from "./authservice.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { TaskRepository } from "./repositories/TaskRepository.js";
import { createAuthRouter } from "./routes/auth.js";
import { createUserRouter } from "./routes/users.js";
import { createTaskRouter } from "./routes/tasks.js";
import { TaskScheduler } from "./jobs/scheduler.js";


export function createApp(deps: {
  authService: AuthService;
  userRepo: UserRepository;
  taskRepo: TaskRepository;
  scheduler: TaskScheduler;

}) {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin, credentials: false }));
  app.use(express.json({ limit: "1mb" }));
  app.use(
    pinoHttp({
      logger: logger as any,
      genReqId: (req: express.Request) => (req.headers["x-request-id"] as string) || nanoid()
    })
  );
  app.use(metricsMiddleware);

  app.use(
    "/api/auth/login",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 20
    })
  );

  app.get(["/health", "/healthz"], (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  app.get("/readyz", async (_req, res) => {
    try {
      await checkDb();
      res.json({ status: "ready" });
    } catch {
      res.status(503).json({ status: "not_ready" });
    }
  });

  app.get("/health/db", async (_req, res) => {
    try {
      await checkDb();
      res.json({ db: "ok" });
    } catch {
      res.status(503).json({ db: "down" });
    }
  });

  app.get("/metrics", async (_req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  });

  app.get("/openapi.json", (_req, res) => {
    res.sendFile(path.join(process.cwd(), "openapi.json"));
  });

  app.use("/api/auth", createAuthRouter(deps.authService));
  app.use("/api/users", createUserRouter(deps.userRepo, deps.authService));
  app.use("/api/tasks", createTaskRouter(deps.taskRepo, deps.authService, deps.scheduler));

  app.use((_req, _res, next) => next(notFound("Route not found")));
  app.use(errorHandler);

  return app;
}
