import "dotenv/config";
import express from "express";
import path from "path";
import { requestLogger } from "./middleware/requestLogger";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";
import apiRouter from "./routes/api";
import logger from "./lib/logger";

const app = express();

app.use(requestLogger);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.use(apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info({ port: PORT, env: process.env.NODE_ENV }, "noteserver started");
});

function shutdown(signal: string) {
  logger.info(`${signal} received — shutting down gracefully...`);
  server.close(() => {
    logger.info("All connections closed. Goodbye");
    process.exit(0);
  });
  setTimeout(() => {
    logger.error("Shutdown timed out.");
    process.exit(1);
  }, 5000);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
