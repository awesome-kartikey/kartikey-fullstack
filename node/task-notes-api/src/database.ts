import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./db/schema.js";
import { config } from "./config.js";
import logger from "./logger.js";

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: config.env === "test" ? 2 : 10,
  idleTimeoutMillis: 10000
});

pool.on("error", (err) => {
  logger.error({ err }, "Postgres pool error");
});

export const db = drizzle(pool, { schema, logger: config.logLevel === "debug" });

export async function checkDb() {
  await db.execute('SELECT 1');
}

export async function closeDb() {
  await pool.end();
}

type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export async function withTransaction<T>(fn: (tx: DbTransaction) => Promise<T>): Promise<T> {
  return await db.transaction(fn);
}
