export type TaskErrorCode = "NOT_FOUND" | "VALIDATION_ERROR" | "STORAGE_ERROR";

export class TaskError extends Error {
  constructor(
    message: string,
    public code: TaskErrorCode,
    public context?: object
  ) {
    super(message);
    this.name = "TaskError";
  }
}
