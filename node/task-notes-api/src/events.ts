import { EventEmitter } from "events";
import { Task } from "./models/task";
import { logger } from "./logger";

export class TaskEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.on("task:created", (task) =>
      logger.info({ taskId: task.id }, "Event: Task Created"),
    );
  }

  emitTaskCreated(task: Task): void {
    this.emit("task:created", task);
  }

  emitTaskUpdated(task: Task): void {
    this.emit("task:updated", task);
  }

  emitTaskDeleted(id: string): void {
    this.emit("task:deleted", id);
  }
}
