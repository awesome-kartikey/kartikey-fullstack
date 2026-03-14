import { loadConfig } from "./config";
import { TaskServer } from "./server";
import { logger } from "./logger";
import { UserDatabase } from "./database";
import { AuthService } from "./auth/service";
import { FileStorage } from "./storage";
import { TaskEventEmitter } from "./events";

async function main() {
  console.log(">>> Bootstrap sequence starting...");

  const config = loadConfig();

  // Initialize Dependencies
  const userDb = new UserDatabase(config.dbPath);
  const authService = new AuthService(userDb, config.jwtSecret);
  const storage = new FileStorage(config.dataPath);
  const events = new TaskEventEmitter();

  // Create Server
  const server = new TaskServer(config, authService, storage, events, userDb);

  // Start Server
  await server.start();

  logger.info(">>> Application is fully initialized and ready.");

  // GRACEFUL SHUTDOWN LOGIC
  const shutdown = async (signal: string) => {
    console.log(""); // Add a newline after the ^C in terminal
    logger.info(`[${signal}] Received. Starting graceful shutdown...`);

    try {
      // 1. Stop Express (stop accepting new requests)
      await server.stop();

      // 2. Close Database
      userDb.close();
      logger.info("Database connection closed.");

      logger.info("Shutdown complete. Goodbye!");
      process.exit(0);
    } catch (err) {
      logger.error({ err }, "Error during shutdown");
      process.exit(1);
    }
  };

  // Listen for termination signals
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

// EXECUTE
main().catch((err) => {
  console.error("FATAL STARTUP ERROR:", err);
  logger.error(err);
  process.exit(1);
});
