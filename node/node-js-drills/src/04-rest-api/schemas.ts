import { z } from "zod";

//Create Task Schema
export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200),
  completed: z.boolean().optional().default(false),
});
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

//Update Task Schema
export const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  completed: z.boolean().optional(),
});
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

//Paginataion Schema
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

//Task Query Schema
export const TaskQuerySchema = PaginationQuerySchema.extend({
  completed: z.enum(["true", "false"]).optional(),
  sort: z.enum(["createdAt", "title"]).optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});
export type TaskQuery = z.infer<typeof TaskQuerySchema>;
