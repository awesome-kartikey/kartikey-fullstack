import dotenv from "dotenv";
dotenv.config();

export const dbConfig = {
  url: process.env.DATABASE_URL || "postgres://localhost:5432/taskapp_dev",
  isProd: process.env.NODE_ENV === "production",
  maxPoolSize: process.env.NODE_ENV === "production" ? 50 : 10,
};
