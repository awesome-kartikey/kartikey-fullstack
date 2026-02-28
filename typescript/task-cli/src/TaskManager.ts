// New functionality: - Centralized task management - Event system for changes - Import/export capabilities
// export class TaskManager {
//   private tasks: Map<string, Task>;
//   private listeners: Set<TaskEventListener>;

//   constructor(initialTasks?: Task[]);

//   add(task: Omit<Task, 'id' | 'createdAt'>): Task;
//   update(id: string, updates: Partial<Task>): Task;
//   delete(id: string): boolean;

//   getStats(): TaskStats;
//   export(): TaskCollection;
// }
