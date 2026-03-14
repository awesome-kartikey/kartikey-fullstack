// lib/env.ts
export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV,
};

// Validate required environment variables
if (!env.API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is required");
}
