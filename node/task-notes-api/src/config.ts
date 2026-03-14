import dotenv from "dotenv";
dotenv.config();

export interface AppConfig {
  port: number;
  logLevel: string;
  env: "development" | "production" | "test";
  jwtSecret: string;
  dataPath: string;
  dbPath: string;
}

export function loadConfig(): AppConfig {
  return {
    port: parseInt(process.env.PORT || "3000", 10),
    logLevel: process.env.LOG_LEVEL || "info",
    env: (process.env.NODE_ENV as any) || "development",
    jwtSecret: process.env.JWT_SECRET || "super-secret-key",
    dataPath: process.env.DATA_PATH || "./data/tasks.json",
    dbPath: process.env.DB_PATH || "./data/users.db",
  };
}
