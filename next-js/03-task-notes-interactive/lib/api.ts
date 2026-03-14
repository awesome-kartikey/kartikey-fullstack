// lib/api.ts
import { env } from "./env";
import { withRetry } from "./retry";
import type { Task } from "./types";

const API_BASE = env.API_URL || "http://localhost:3001";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new ApiError(`API Error: ${response.statusText}`, response.status);
    }
    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out");
    }

    throw error;
  }
}

export const api = {
  // Get all tasks
  getTasks: (): Promise<Task[]> =>
    withRetry(() => apiRequest<Task[]>("/api/tasks")),

  // Get single task
  getTask: (id: string): Promise<Task> => apiRequest<Task>(`/api/tasks/${id}`),

  // Create task
  createTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">,
  ): Promise<Task> =>
    apiRequest<Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    }),

  // Update task
  updateTask: (id: string, updates: Partial<Task>): Promise<Task> =>
    apiRequest<Task>(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  // Delete task
  deleteTask: (id: string): Promise<void> =>
    apiRequest<void>(`/api/tasks/${id}`, {
      method: "DELETE",
    }),
};
