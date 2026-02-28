// Result vs throw: Implement a parseConfig() function twice: once returning a Result<T> type and once throwing AppError. Write a small driver script to show how call‑sites handle each style. Discuss readability and ergonomics.

type Ok<T> = { ok: true; value: T };
type Err = {
  ok: false;
  code: string;
  message: string;
  cause?: unknown;
};
export type Result<T> = Ok<T> | Err;
export const ok = <T>(v: T): Ok<T> => ({ ok: true, value: v });
export const err = (code: string, message: string, cause?: unknown): Err => ({
  ok: false,
  code,
  message,
  cause,
});

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public meta?: Record<string, unknown>,
    options?: { cause?: unknown },
  ) {
    super(message);
    this.name = "AppError";
    if (options?.cause) (this as any).cause = options.cause;
  }
}
/*******************************************************************************/

interface Config {
  value: string;
}

function parseConfig(data: string): Result<Config> {
  try {
    const config = JSON.parse(data);
    return ok(config);
  } catch (e) {
    return err("INVALID_JSON", "Invalid JSON");
  }
}

const result = parseConfig("input");
if (!result.ok) {
  console.error(result.code, result.message);
}

/*******************************************************************************/

function parseConfig2(data: string): Config {
  try {
    return JSON.parse(data);
  } catch (e) {
    throw new Error("Invalid JSON");
  }
}

try {
  const config = parseConfig2("input");
  console.log(config);
} catch (e) {
  console.error(e);
}
