import { Pool, QueryResult } from "pg";
import { dbConfig } from "../config/database.js";

export const pool = new Pool({
  connectionString: dbConfig.url,
  max: dbConfig.maxPoolSize,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export class DbError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function query(
  text: string,
  params: any[] = [],
): Promise<QueryResult> {
  const start = performance.now();
  try {
    const res = await pool.query(text, params);
    const duration = performance.now() - start;

    // Structured Logging for Slow Queries
    if (duration > 100) {
      console.warn(
        JSON.stringify({
          level: "WARN",
          msg: "SLOW QUERY",
          durationMs: Math.round(duration),
          query: text,
        }),
      );
    } else {
      console.log(
        JSON.stringify({
          level: "INFO",
          msg: "Query Executed",
          durationMs: Math.round(duration),
        }),
      );
    }

    return res;
  } catch (err: any) {
    console.error(
      JSON.stringify({
        level: "ERROR",
        msg: "Query Failed",
        error: err.message,
        query: text,
      }),
    );

    if (err.code === "23505")
      throw new DbError(409, "Conflict: Resource already exists.");
    if (err.code === "23503")
      throw new DbError(400, "Bad Request: Referenced resource missing.");
    throw new DbError(500, "Internal Database Error.");
  }
}
