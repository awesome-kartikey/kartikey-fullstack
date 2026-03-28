import http from "http";
import { config } from "./config.js";
import logger from "./logger.js";
import { createApp } from "./server.js";
import { checkDb, closeDb } from "./database.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { TaskRepository } from "./repositories/TaskRepository.js";
import { AuthService } from "./authservice.js";
import { TaskScheduler } from "./jobs/scheduler.js";


async function main() {
  await checkDb();

  const userRepo = new UserRepository();
  const taskRepo = new TaskRepository();
  const authService = new AuthService(userRepo);
  const scheduler = new TaskScheduler();


  const app = createApp({ authService, userRepo, taskRepo, scheduler });
  const server = http.createServer(app);

  server.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully`);
    server.close(async () => {
      await scheduler.close();
      await closeDb();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  logger.error({ err }, "Fatal startup error");
  process.exit(1);
});
