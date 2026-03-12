import { randomUUID } from "node:crypto";
import type { Task, Priority } from "./types.js";

export function createTask(title: string, priority: Priority = 'medium'): Task {
  return {
    id: randomUUID(),
    title,
    completed: false,
    priority,
    createdAt: new Date(),
  };
}

export function markCompleted(task: Task): Task {
  return { ...task, completed: true };
}

export function filterByStatus(tasks: Task[], status: boolean): Task[] {
  return tasks.filter((task) => task.completed === status);
}

export function sortByPriority(tasks: Task[]): Task[] {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  return [...tasks].sort(
    (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
  );
}
