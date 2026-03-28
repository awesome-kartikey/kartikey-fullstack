import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium")
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  completed: z.boolean().optional()
});
