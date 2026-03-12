import pino from "pino";
export const log = pino({ level: process.env.LOG_LEVEL ?? "info" });
log.info({ app: "TaskCLI", status: "starting" }, "Application booting up...");
log.error({ err: new Error("DB connection failed") }, "Failed to connect");