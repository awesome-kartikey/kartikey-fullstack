import { HttpError } from "./httpClient.js";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 500
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const status = err.status || 0;
      const isRetryable = !err.status || status === 429 || status >= 500;

      if (!isRetryable || attempt === maxAttempts) {
        throw err;
      }

      let delayMs = baseDelayMs * Math.pow(2, attempt - 1);

      if (status === 429 && err.retryAfter) {
        delayMs = err.retryAfter * 1000;
      } else {
        const jitter = delayMs * 0.3 * Math.random();
        delayMs += jitter;
      }

      console.warn(`[RETRY] Attempt ${attempt} failed. Retrying in ${Math.round(delayMs)}ms`);
      await sleep(delayMs);
    }
  }
  throw new Error("Unreachable");
}
