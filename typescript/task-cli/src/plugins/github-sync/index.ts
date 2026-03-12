import chalk from "chalk";
import type { TaskPlugin } from "../index.js";

export function createGithubSyncPlugin(): TaskPlugin {
  return {
    name: "github-sync",
    version: "1.0.0",
    hooks: {
      onInit: () => {
        console.log(chalk.gray("[GitHub Sync] Plugin initialized."));
      }
    },
    commands: [
      {
        name: "sync-github",
        description: "Sync tasks with GitHub issues",
        handler: async () => {
          console.log(chalk.blue("Fetching issues from GitHub..."));
          // Mock delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log(chalk.green("✓ Successfully synced 0 issues from GitHub."));
        }
      }
    ]
  };
}
