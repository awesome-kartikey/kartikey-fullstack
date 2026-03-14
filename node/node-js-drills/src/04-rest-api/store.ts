export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export const taskStore = new Map<string, Task>();

taskStore.set("1", {
  id: "1",
  title: "Learn REST patterns",
  completed: false,
  createdAt: new Date().toISOString(),
});

taskStore.set("2", {
  id: "2",
  title: "Learn Authentication, Authorization, and Security",
  completed: true,
  createdAt: new Date().toISOString(),
});

taskStore.set("3", {
  id: "3",
  title: "Go for a walk",
  completed: false,
  createdAt: new Date().toISOString(),
});
