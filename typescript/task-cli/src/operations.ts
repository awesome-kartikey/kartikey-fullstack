// New functionality: - CRUD operations for tasks - Filtering and sorting functions - Input validation functions
import type { Task, Priority } from "./types";

//Create
export function createTask(title: string, priority: Priority = "medium"): Task {
  return {
    id: crypto.randomUUID(),
    title,
    completed: false,
    priority,
    createdAt: new Date(),
  };
}

//Update
export function markCompleted(task: Task): Task {
  return { ...task, completed: true };
}

//Filter - Read
export function filterByStatus(tasks: Task[], status: boolean): Task[] {
  return tasks.filter((task) => task.completed === status);
}
export function sortByPriority(tasks: Task[]): Task[] {
  const priorityOrder = { high: 3, medium: 2, low: 1 };

  return [...tasks].sort((a, b) => {
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}
