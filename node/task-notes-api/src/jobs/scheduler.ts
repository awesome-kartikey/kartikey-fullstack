import { Queue } from "bullmq";
import { config } from "../config.js";
import { Redis } from "ioredis";

export const redisConnection = new Redis(config.redisUrl || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export class TaskScheduler {
  private queue: Queue;

  constructor() {
    this.queue = new Queue("tasks-queue", { connection: redisConnection as any });
  }

  async scheduleReminder(taskId: string, dueDate: Date): Promise<void> {
    const delay = dueDate.getTime() - Date.now();
    await this.queue.add("send-reminder", { taskId }, { delay });
  }

  async scheduleCleanup(): Promise<void> {
    await this.queue.add(
      "cleanup-tasks",
      {},
      { repeat: { pattern: "0 0 * * *" } },
    );
  }

  async close(): Promise<void> {
    await this.queue.close();
    await redisConnection.quit();
  }
}
