import chalk from "chalk";
import type { TaskPlugin } from "../index.js";
import type { TaskManager } from "../../TaskManager.js";

export function createReportingPlugin(manager: TaskManager): TaskPlugin {
  return {
    name: "reporting",
    version: "1.0.0",
    commands: [
      {
        name: "report",
        description: "Generate a weekly task report",
        handler: () => {
          const stats = manager.getStats();
          console.log(chalk.cyan("\n📊 Weekly Task Report"));
          console.log(chalk.white(`Total Completed: ${stats.byStatus.completed}`));
          console.log(chalk.white(`Total Pending: ${stats.byStatus.pending}`));
          console.log(chalk.gray(`High Priority: ${stats.byPriority.high}`));
        },
      },
    ],
  };
}
