//app/tasks/new/actions.ts
"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

interface CreateTaskInput {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  completed?: boolean;
}

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(50),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  completed: z.boolean().optional(),
});

export async function createTaskAction(data: CreateTaskInput) {
  // Server-side validation check
  const validated = taskSchema.safeParse(data);
  if (!validated.success) {
    throw new Error("Invalid task data: " + validated.error.message);
  }

  const task = {
    title: data.title.trim(),
    description: data.description?.trim() || "",
    priority: data.priority,
    completed: false, // Force new tasks to be incomplete
  };

  await api.createTask(task);
  console.log("Task created:", task);
  revalidatePath("/tasks");
  redirect("/tasks");
}
