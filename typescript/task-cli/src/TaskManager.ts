import { randomUUID } from "node:crypto";
import type { Task } from "./types.js";
import { calculateStats, type TaskCollection, type TaskStats } from "./collection.js";

export type TaskEventListener = (event: string, task: Task) => void;

export class TaskManager {
  private tasks: Map<string, Task>;
  private listeners: Set<TaskEventListener>;

  constructor(initialTasks?: Task[]) {
    this.tasks = new Map();
    this.listeners = new Set();

    if (initialTasks) {
      initialTasks.forEach((task) => this.tasks.set(task.id, task));
    }
  }

  add(taskData: Omit<Task, 'id' | 'createdAt'>): Task {
    const task: Task = {
      ...taskData,
      id: randomUUID(),
      createdAt: new Date(),
    };
    this.tasks.set(task.id, task);
    this.notify("added", task);
    return task;
  }

  update(id: string, updates: Partial<Task>): Task {
    const existing = this.tasks.get(id);
    if (!existing) throw new Error(`Task ${id} not found`);
    
    const updated = { ...existing, ...updates };
    this.tasks.set(id, updated);
    this.notify("updated", updated);
    return updated;
  }

  delete(id: string): boolean {
    const task = this.tasks.get(id);
    if (task) {
      this.tasks.delete(id);
      this.notify("deleted", task);
      return true;
    }
    return false;
  }

  getStats(): TaskStats {
    return calculateStats(Array.from(this.tasks.values()));
  }

  export(): TaskCollection {
    const tasksArray = Array.from(this.tasks.values());
    return {
      tasks: tasksArray,
      metadata: {
        total: tasksArray.length,
        completed: tasksArray.filter((t) => t.completed).length,
        lastModified: new Date(),
      },
    };
  }

  getAll(): Task[] {
    return Array.from(this.tasks.values());
  }

  private notify(action: string, task: Task) {
    this.listeners.forEach((listener) => listener(action, task));
  }
}
