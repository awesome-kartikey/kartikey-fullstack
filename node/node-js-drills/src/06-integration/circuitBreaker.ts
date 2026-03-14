type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export function createCircuitBreaker<T>(
  fn: () => Promise<T>,
  failureThreshold = 3,
  recoveryMs = 10000
) {
  let state: CircuitState = "CLOSED";
  let failures = 0;
  let nextAttemptTime = 0;

  return async function (): Promise<T> {
    if (state === "OPEN") {
      if (Date.now() > nextAttemptTime) {
        state = "HALF_OPEN";
      } else {
        throw new Error("Circuit Breaker OPEN - Fast Failing request");
      }
    }

    try {
      const result = await fn();
      failures = 0;
      state = "CLOSED";
      return result;
    } catch (err) {
      failures++;
      if (failures >= failureThreshold) {
        state = "OPEN";
        nextAttemptTime = Date.now() + recoveryMs;
      }
      throw err;
    }
  };
}

export const metrics = {
  "2xx": 0,
  "4xx": 0,
  "5xx": 0,
  latencies: [] as number[]
};

export function recordMetrics(statusCode: number, durationMs: number) {
  metrics.latencies.push(durationMs);

  if (durationMs > 500) {
    console.warn(`[SLOW API] Response took ${durationMs}ms`);
  }

  if (statusCode >= 200 && statusCode < 300) metrics["2xx"]++;
  else if (statusCode >= 400 && statusCode < 500) metrics["4xx"]++;
  else if (statusCode >= 500) metrics["5xx"]++;
}
