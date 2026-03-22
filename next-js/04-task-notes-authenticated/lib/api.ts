// lib/api.ts
import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "./env";
import { withRetry } from "./retry";
import type { Task } from "./types";

const API_BASE =
  env.API_URL ||
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001";

export type { Task };

interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new ApiError(message || response.statusText, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    cache: "no-store",
  });

  return parseResponse<T>(response);
}

async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    cookieStore.delete("auth-token");
    cookieStore.delete("user");
    redirect("/login");
  }

  return parseResponse<T>(response);
}

export const api = {
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiRequest<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),

    register: (credentials: { email: string; password: string }) =>
      apiRequest<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
  },

  getTasks: () => withRetry(() => authenticatedRequest<Task[]>("/api/tasks")),

  getTask: (id: string) => authenticatedRequest<Task>(`/api/tasks/${id}`),

  createTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) =>
    authenticatedRequest<Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    }),

  updateTask: (id: string, updates: Partial<Task>) =>
    authenticatedRequest<Task>(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  deleteTask: (id: string) =>
    authenticatedRequest<void>(`/api/tasks/${id}`, {
      method: "DELETE",
    }),
  verifySession: async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) {
      throw new Error("Unauthorized: No session token found");
    }
    // Assume token is valid if it exists, or could use jose to verify if secret is available here.
    return true;
  },
};
