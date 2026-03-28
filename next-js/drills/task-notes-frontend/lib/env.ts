// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters long").optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const _env = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
});

if (!_env.success) {
  console.error("Invalid environment variables:", _env.error.issues);
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
