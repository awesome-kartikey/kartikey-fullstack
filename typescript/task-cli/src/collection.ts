import type { Task, Priority } from "./types.js";

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

export function calculateStats(tasks: Task[]): TaskStats {
  const stats: TaskStats = {
    byPriority: { low: 0, medium: 0, high: 0 },
    byStatus: { pending: 0, completed: 0 },
    averageAge: 0,
  };

  if (tasks.length === 0) return stats;

  let totalAgeMs = 0;
  const now = Date.now();

  tasks.forEach((task) => {
    stats.byPriority[task.priority]++;
    const status = task.completed ? "completed" : "pending";
    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
    totalAgeMs += now - task.createdAt.getTime();
  });

  stats.averageAge = totalAgeMs / tasks.length;
  return stats;
}
