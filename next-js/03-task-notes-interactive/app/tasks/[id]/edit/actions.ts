"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";

// Define the exact shape we expect to receive from the client form
interface UpdateTaskInput {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  completed?: boolean;
}

export async function updateTaskAction(id: string, data: UpdateTaskInput) {
  try {
    await api.updateTask(id, data);
  } catch {
    throw new Error("Failed to update task");
  }

  // Redirect to task detail page after successful update
  revalidatePath("/tasks");
  revalidatePath(`/tasks/${id}`);
  redirect(`/tasks/${id}`);
}
