// New functionality: - Task collection interface - Statistics calculation - Metadata tracking
import { Task, Priority } from "./types";

export interface TaskCollection {
  tasks: Task[];
  metadata: {
    total: number;
    completed: number;
    lastModified: Date;
  };
}

export interface TaskStats {
  byPriority: Record<Priority, number>;
  byStatus: Record<string, number>;
  averageAge: number;
}

export function calculateStats() {}
