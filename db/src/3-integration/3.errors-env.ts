import { Pool, QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Set up different database connections for dev/test/production.
// Use environment variables for connection strings and pool sizes.
// Configure SSL for production database connections.
const isProd = process.env.NODE_ENV === "production";
const config = {
  dbUrl: isProd ? process.env.PROD_DATABASE_URL : process.env.DATABASE_URL,
  poolSize: isProd ? 50 : 10,
  sslConfig: isProd ? { rejectUnauthorized: false } : false,
};

const primaryPool = new Pool({
  connectionString: config.dbUrl,
  max: config.poolSize,
  ssl: config.sslConfig,
});

// Implement read replicas for query scaling (simulation).
const readReplicaPool = new Pool({
  connectionString: process.env.READ_REPLICA_URL || config.dbUrl,
  max: config.poolSize,
  ssl: config.sslConfig,
});

// Add database monitoring with basic metrics collection.
const dbMetrics = {
  queryCount: 0,
  errors: 0,
  slowQueries: 0,
};

// Implement circuit breaker pattern for database unavailability.
const circuitBreaker = {
  failures: 0,
  isOpen: false,
  threshold: 3,
  resetTimeout: 5000,
  lastFailureTime: 0,
};

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

// Map PostgreSQL error codes to meaningful application errors.
function mapDatabaseError(err: any): AppError {
  if (err.code === "23505")
    return new AppError(409, "Conflict: Resource already exists.");
  if (err.code === "23503")
    return new AppError(400, "Bad Request: Referenced record does not exist.");
  if (err.code === "23514")
    return new AppError(400, "Bad Request: Data does not meet constraints.");
  return new AppError(500, "Internal Server Error");
}

// Add request correlation IDs for tracing database operations.
async function executeQuery(
  text: string,
  params: any[] = [],
  correlationId: string = "req-unknown",
  useReplica = false,
): Promise<QueryResult> {
  if (circuitBreaker.isOpen) {
    const timeSinceLastFailure = Date.now() - circuitBreaker.lastFailureTime;
    if (timeSinceLastFailure > circuitBreaker.resetTimeout) {
      circuitBreaker.isOpen = false;
      circuitBreaker.failures = 0;
      console.log(
        `[${correlationId}] Circuit breaker half-open, attempting query.`,
      );
    } else {
      throw new AppError(
        503,
        "Service Unavailable: Database circuit breaker is open.",
      );
    }
  }

  const start = performance.now();
  const targetPool = useReplica ? readReplicaPool : primaryPool;

  try {
    const res = await targetPool.query(text, params);
    const duration = performance.now() - start;
    dbMetrics.queryCount++;

    // Log slow queries (>100ms) with query text and parameters.
    if (duration > 100) {
      dbMetrics.slowQueries++;
      console.warn(
        `[${correlationId}] Slow query (${Math.round(duration)}ms): ${text} | Params: ${JSON.stringify(params)}`,
      );
    } else {
      console.log(
        `[${correlationId}] Query executed in ${Math.round(duration)}ms`,
      );
    }

    circuitBreaker.failures = 0;
    circuitBreaker.isOpen = false;

    return res;
  } catch (err: any) {
    dbMetrics.errors++;
    circuitBreaker.failures++;
    circuitBreaker.lastFailureTime = Date.now();

    if (circuitBreaker.failures >= circuitBreaker.threshold) {
      circuitBreaker.isOpen = true;
      console.error(`[ERROR] [${correlationId}] Circuit breaker tripped open.`);
    }

    console.error(`[ERROR] [${correlationId}] Query Failed:`, err.message);
    throw mapDatabaseError(err);
  }
}

async function drillSet5And6() {
  try {
    await executeQuery(
      "CREATE TABLE IF NOT EXISTS test_logging (id SERIAL PRIMARY KEY, email TEXT UNIQUE)",
      [],
      "req-init",
    );

    // Trigger slow query tracking
    await executeQuery("SELECT pg_sleep(0.15)", [], "req-test-slow");

    // Handle unique constraint violations with user-friendly messages.
    try {
      await executeQuery(
        "INSERT INTO test_logging (email) VALUES ($1)",
        ["duplicate@test.com"],
        "req-insert-1",
      );
      // Test duplicate email insertion.
      await executeQuery(
        "INSERT INTO test_logging (email) VALUES ($1)",
        ["duplicate@test.com"],
        "req-insert-2",
      );
    } catch (err: any) {
      console.log(
        `Mapped App Error Output: [${err.statusCode}] ${err.message}`,
      );
    }

    // Use read replica
    await executeQuery(
      "SELECT * FROM test_logging",
      [],
      "req-read-replica",
      true,
    );

    console.log("Current DB Metrics Tracker:", dbMetrics);
  } finally {
    await executeQuery(
      "DROP TABLE IF EXISTS test_logging CASCADE",
      [],
      "req-cleanup",
    );
  }
}

async function main() {
  console.log("\n Running Drills 5 & 6 ");
  await drillSet5And6();

  console.log("Closing database connections.");
  await primaryPool.end();
  await readReplicaPool.end();
}

main();
