import dotenv from "dotenv";
dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  logLevel: process.env.LOG_LEVEL || "info",
  jwtSecret: requireEnv("JWT_SECRET"),
  jwtRefreshSecret: requireEnv("JWT_REFRESH_SECRET"),
  databaseUrl: requireEnv("DATABASE_URL"),
  redisUrl: process.env.REDIS_URL,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000"
};
