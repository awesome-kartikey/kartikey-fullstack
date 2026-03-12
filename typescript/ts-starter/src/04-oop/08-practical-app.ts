// 8) Practical Class Applications¶
// Create a Logger class with different log levels (info, warn, error).
// Build a simple Cache class that stores key-value pairs with size limits.
// Implement a Timer class that tracks elapsed time with start/stop/reset methods.
// Create a ValidationResult class that holds success/failure state and error messages.

type LogLevel = "info" | "warn" | "error";

class Logger {
  private level: LogLevel;

  constructor(level: LogLevel = "info") {
    this.level = level;
  }

  info(msg: string) {
    if (this.level === "info") console.log(`INFO: ${msg}`);
  }
  warn(msg: string) {
    if (this.level === "info" || this.level === "warn") console.log(`WARN: ${msg}`);
  }
  error(msg: string) {
    console.log(`ERROR: ${msg}`);
  }
}

class Cache<T> {
  private store = new Map<string, T>();

  constructor(private limit: number) {}

  set(key: string, value: T) {
    if (this.store.size >= this.limit) {
      // Remove the oldest key
      const firstKey = this.store.keys().next().value;
      if (firstKey) this.store.delete(firstKey);
    }
    this.store.set(key, value);
  }

  get(key: string): T | undefined {
    return this.store.get(key);
  }
}

class Timer {
  private startTime = 0;
  private elapsed = 0;
  private isRunning = false;

  start() {
    if (!this.isRunning) {
      this.startTime = Date.now();
      this.isRunning = true;
    }
  }

  stop() {
    if (this.isRunning) {
      this.elapsed += Date.now() - this.startTime;
      this.isRunning = false;
    }
  }

  reset() {
    this.elapsed = 0;
    this.isRunning = false;
  }
}

class ValidationResult {
  constructor(
    public success: boolean,
    public errors: string[] = [],
  ) {}

  static ok() {
    return new ValidationResult(true);
  }

  static fail(errors: string[]) {
    return new ValidationResult(false, errors);
  }
}
