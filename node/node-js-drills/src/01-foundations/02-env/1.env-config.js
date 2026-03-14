// Create a .env file and load it with dotenv.
// Print a variable like API_KEY from process.env.
// Override the variable from the command line (API_KEY=123 node script.js).
// Implement fallback defaults if a variable is missing.
// Write a function requireEnv(name) that throws if not defined.

import dotenv from "dotenv";
dotenv.config();
console.log("API_KEY:", process.env.API_KEY);
console.log("DB_HOST:", process.env.DB_HOST);

// API_KEY=override123 node override.js

const config = {
  API_KEY: process.env.API_KEY || "default-api-key-123",
  PORT: process.env.PORT || 3000,
  DB_HOST: process.env.DB_HOST || "localhost",
};

function requireEnv(name) {
  if (!config[name]) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return config[name];
}

try {
  const apiKey = requireEnv("API_KEY");
  console.log("API_KEY:", apiKey);

  const missingKey = requireEnv("MISSING_KEY");
} catch (error) {
  console.error("Error:", error.message);
  process.exit(1);
}
