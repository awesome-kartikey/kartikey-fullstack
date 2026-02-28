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

}
