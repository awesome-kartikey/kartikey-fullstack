import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "node:fs/promises";
import { TaskManager } from "./TaskManager.js";
import { FileStorage } from "./storage.js";
import { TaskSyncManager } from "./sync.js";
import type { TaskCollection } from "./collection.js";
import { createReportingPlugin } from "./plugins/reporting/index.js";
import { createGithubSyncPlugin } from "./plugins/github-sync/index.js";

export class TaskCLI {
  private program: Command;
  private storage: FileStorage<TaskCollection>;
  private syncManager: TaskSyncManager;
  private plugins: Map<string, any> = new Map();

  constructor(private manager: TaskManager) {
    this.program = new Command();
    this.storage = new FileStorage("./data");

    // Mock remote for sync testing
    const mockRemote = {
      push: async () => console.log(chalk.gray("Pushing to remote...")),
      pull: async () => ({ tasks: manager.getAll(), metadata: manager.export().metadata }),
    };

    this.syncManager = new TaskSyncManager(this.storage, mockRemote);
    this.setupCommands();
  }

  private async loadState() {
    const data = await this.storage.load("local_db");
    if (data && data.tasks) {
      data.tasks.forEach((t) => this.manager.add(t));
    }
  }

  private async saveState() {
    await this.storage.save("local_db", this.manager.export());
  }

  async run(args: string[]): Promise<void> {
    await this.loadState();
    await this.program.parseAsync(args);
  }

  private setupCommands(): void {
    this.program.name("task").description("Progressive Task Management CLI").version("1.0.0");

    // --- Basic Operations ---
    this.program
      .command("add <title>")
      .description("Add a new task")
      .option("--priority <level>", "Task priority", "medium")
      .action(async (title, options) => {
        const task = this.manager.add({ title, completed: false, priority: options.priority });
        await this.saveState();
        console.log(chalk.green(`✓ Task added: ${task.title} [ID: ${task.id.slice(0, 8)}]`));
      });

    this.program
      .command("list")
      .description("List tasks")
      .option("--status <status>", "pending or completed")
      .option("--priority <priority>", "high, medium, or low")
      .action((options) => {
        let tasks = this.manager.getAll();
        if (options.status === "pending") tasks = tasks.filter((t) => !t.completed);
        if (options.status === "completed") tasks = tasks.filter((t) => t.completed);
        if (options.priority) tasks = tasks.filter((t) => t.priority === options.priority);

        if (tasks.length === 0) return console.log(chalk.yellow("No tasks found."));

        console.table(
          tasks.map((t) => ({
            ID: t.id.slice(0, 8),
            Title: t.title,
            Priority: t.priority,
            Status: t.completed ? "Done" : "Pending",
          })),
        );
      });

    this.program
      .command("complete <id>")
      .description("Complete a task by ID")
      .action(async (id) => {
        try {
          const tasks = this.manager.getAll();
          const target = tasks.find((t) => t.id.startsWith(id));
          if (!target) throw new Error("Not found");

          this.manager.update(target.id, { completed: true });
          await this.saveState();
          console.log(chalk.green(`✓ Task ${id} marked as complete.`));
        } catch {
          console.log(chalk.red(`✖ Task ${id} not found.`));
        }
      });

    this.program
      .command("delete <id>")
      .description("Delete a task by ID")
      .action(async (id) => {
        const tasks = this.manager.getAll();
        const target = tasks.find((t) => t.id.startsWith(id));

        if (target && this.manager.delete(target.id)) {
          await this.saveState();
          console.log(chalk.green(`✓ Task ${id} deleted.`));
        } else {
          console.log(chalk.red(`✖ Task ${id} not found.`));
        }
      });

    // --- Advanced Features ---
    this.program
      .command("stats")
      .description("View stats")
      .action(() => console.dir(this.manager.getStats(), { depth: null }));

    this.program
      .command("export")
      .description("Export tasks")
      .option("--format <format>", "Export format", "json")
      .action(async (options) => {
        const data = this.manager.export();
        await fs.writeFile("tasks.json", JSON.stringify(data, null, 2));
        console.log(chalk.green("✓ Exported to tasks.json"));
      });

    this.program
      .command("import <file>")
      .description("Import tasks")
      .action(async (file) => {
        try {
          const content = await fs.readFile(file, "utf-8");
          const data: TaskCollection = JSON.parse(content);
          data.tasks.forEach((t) => this.manager.add(t));
          await this.saveState();
          console.log(chalk.green(`✓ Imported ${data.tasks.length} tasks.`));
        } catch (e) {
          console.log(chalk.red("✖ Failed to import tasks."));
        }
      });

    this.program
      .command("sync")
      .description("Sync with remote")
      .option("--remote <name>", "Remote name")
      .action(async (options) => {
        console.log(chalk.blue(`Syncing with ${options.remote || "default remote"}...`));
        const result = await this.syncManager.sync();
        if (result.success) console.log(chalk.green("✓ Sync complete."));
        else console.log(chalk.red(`✖ Sync failed: ${result.error}`));
      });

    // --- Interactive Mode ---
    this.program
      .command("interactive")
      .description("Enter interactive mode")
      .action(() => this.interactive());

    // --- Plugin System ---
    this.program
      .command("plugin install <name>")
      .description("Install a plugin")
      .action((name) => {
        if (name === "reporting") {
          const plugin = createReportingPlugin(this.manager);
          plugin.commands?.forEach((cmd) => {
            this.program.command(cmd.name).description(cmd.description).action(cmd.handler);
          });
          this.plugins.set(name, plugin);
          console.log(chalk.green(`✓ Installed plugin: ${name}`));
        } else if (name === "github-sync") {
          const plugin = createGithubSyncPlugin();
          plugin.commands?.forEach((cmd) => {
            this.program.command(cmd.name).description(cmd.description).action(cmd.handler);
          });
          this.plugins.set(name, plugin);
          console.log(chalk.green(`✓ Installed plugin: ${name}`));
        } else {
          console.log(chalk.red(`✖ Unknown plugin: ${name}`));
        }
      });
  }

  private async interactive(): Promise<void> {
    console.log(chalk.blue("Entering interactive mode..."));
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["View Tasks", "Add Task", "Exit"],
      },
    ]);

    if (action === "Exit") process.exit(0);

    if (action === "View Tasks") {
      const tasks = this.manager.getAll();
      console.table(
        tasks.map((t) => ({ Title: t.title, Status: t.completed ? "Done" : "Pending" })),
      );
    }
  }
}
