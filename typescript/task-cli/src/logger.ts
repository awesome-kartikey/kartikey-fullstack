import chalk from "chalk";

export type LogLevel = "info" | "warn" | "error";

export class Logger {
  constructor(private level: LogLevel = "info") {}

  info(message: string, context?: object): void {
    if (this.level === "info") console.log(chalk.blue("ℹ ") + message, context || "");
  }

  warn(message: string, context?: object): void {
    if (this.level !== "error") console.log(chalk.yellow("⚠ ") + message, context || "");
  }

  error(error: Error, context?: object): void {
    console.error(chalk.red("✖ ") + error.message, context || "");
  }
}
