//lib/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";

export async function toggleTaskCompletion(id: string, completed: boolean) {
  await api.verifySession();
  await api.updateTask(id, { completed });
  revalidatePath("/tasks");
  revalidatePath(`/tasks/${id}`);
}

export async function deleteTask(id: string) {
  await api.verifySession();
  await api.deleteTask(id);
  revalidatePath("/tasks");
}

export async function bulkDeleteTasks(ids: string[]) {
  await api.verifySession();
  await Promise.all(ids.map((id) => api.deleteTask(id)));
  revalidatePath("/tasks");
}

export async function updateTaskDescription(id: string, description: string) {
  await api.verifySession();
  await api.updateTask(id, { description });
  revalidatePath(`/tasks/${id}`);
}
