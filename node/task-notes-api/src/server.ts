import express, { Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { Server } from "http";
import { AppConfig } from "./config";
import { logger } from "./logger";
import { UserDatabase } from "./database";
import { AuthService } from "./auth/service";
import { FileStorage } from "./storage";
import { TaskEventEmitter } from "./events";
import { createAuthRouter } from "./routes/auth";
import { createTaskRouter } from "./routes/tasks";
import { createUserRouter } from "./routes/users";
import { HealthChecker } from "./monitoring";
import { MetricsCollector } from "./metrics";

export class TaskServer {
  private app: Express;
  private server?: Server;
  private metrics: MetricsCollector;

  constructor(
    private config: AppConfig,
    private authService: AuthService,
    private storage: FileStorage,
    private events: TaskEventEmitter,
    private userDb: UserDatabase, // <--- ADD THIS so the users route can query the DB
  ) {
    this.app = express();
    this.metrics = new MetricsCollector();
    this.setupApp();
  }

  private setupApp(): void {
    // Global Middleware
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(pinoHttp({ logger }));

    // Metrics tracking middleware
    this.app.use((req, res, next) => {
      const start = Date.now();
      res.on("finish", () =>
        this.metrics.recordRequest(req.method, req.path, Date.now() - start),
      );
      next();
    });

    const health = new HealthChecker();

    // Health & Metrics (Final API Features)
    this.app.get("/health", async (req, res) =>
      res.json(await health.checkHealth()),
    );
    this.app.get("/metrics", (req, res) => res.json(this.metrics.getMetrics()));

    // API Routes
    this.app.use("/api/auth", createAuthRouter(this.authService));
    this.app.use("/api/tasks", createTaskRouter(this.storage, this.events));
    this.app.use("/api/users", createUserRouter(this.userDb)); // <--- ADD THIS

    // Global Error Handler
    this.app.use(
      (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        logger.error({ err }, "Unhandled Request Error");
        this.metrics.recordError(err); // Record the error in metrics
        res.status(500).json({ error: "Internal Server Error" });
      },
    );
  }

  // ... (keep start() and stop() methods the same)
  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.config.port, () => {
        // Use BOTH console and logger for this drill to be 100% sure
        console.log(`[OK] Server listening on port ${this.config.port}`);
        logger.info(
          `Task Notes API running on port ${this.config.port} in ${this.config.env} mode`,
        );
        resolve();
      });
    });
  }
  // Inside src/server.ts

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close((err) => {
          if (err) {
            logger.error({ err }, "Error closing Express server");
            return reject(err);
          }
          logger.info("Express server stopped.");
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
