import { Queue, Job } from "bullmq";

export class TaskScheduler {
  constructor(private queue: Queue) {}

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
}
