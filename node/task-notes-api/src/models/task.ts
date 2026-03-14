import { z } from "zod";

export interface Task {
  id: string;
  userId: number; // Added to link tasks to users
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const UpdateTaskSchema = CreateTaskSchema.partial().extend({
  completed: z.boolean().optional(),
});
