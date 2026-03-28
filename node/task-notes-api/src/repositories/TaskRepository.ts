import { and, desc, eq } from "drizzle-orm";
import { db } from "../database.js";
import { tasks } from "../db/schema.js";

export type Task = typeof tasks.$inferSelect;

const taskSelectObj = {
  id: tasks.id,
  title: tasks.title,
  description: tasks.description,
  priority: tasks.priority,
  completed: tasks.completed,
  userId: tasks.user_id,
  createdAt: tasks.created_at,
  updatedAt: tasks.updated_at
};

export class TaskRepository {
  async createTask(input: {
    id: string;
    userId: number;
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high";
  }) {
    const res = await db.insert(tasks).values({
      id: input.id,
      user_id: input.userId,
      title: input.title,
      description: input.description || null,
      priority: input.priority || "medium"
    }).returning(taskSelectObj);
    return res[0];
  }

  async getTaskById(id: string) {
    const res = await db.select(taskSelectObj).from(tasks).where(eq(tasks.id, id)).limit(1);
    return res[0] || null;
  }

  async listTasks(options: {
    actorUserId: number;
    actorRole: string;
    page?: number;
    limit?: number;
    priority?: string;
    completed?: string;
  }) {
    const limit = Math.min(100, Math.max(1, Number(options.limit || 10)));
    const conditions = [];

    if (options.actorRole !== "admin") {
      conditions.push(eq(tasks.user_id, options.actorUserId));
    }
    if (options.priority) {
      conditions.push(eq(tasks.priority, options.priority));
    }
    if (typeof options.completed !== "undefined") {
      conditions.push(eq(tasks.completed, options.completed === "true"));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const page = Math.max(1, Number(options.page || 1));
    const offset = (page - 1) * limit;

    const res = await db.select(taskSelectObj)
      .from(tasks)
      .where(whereClause)
      .orderBy(desc(tasks.updated_at), desc(tasks.id))
      .limit(limit)
      .offset(offset);

    return { items: res };
  }

  async updateTask(id: string, patch: Partial<Pick<Task, "title" | "description" | "priority" | "completed">>) {
    const ObjectKeys = Object.keys(patch);
    if (ObjectKeys.length === 0) {
      return this.getTaskById(id);
    }

    const updateData = { ...patch, updated_at: new Date().toISOString() };

    const res = await db.update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning(taskSelectObj);

    return res[0] || null;
  }

  async deleteTask(id: string) {
    const res = await db.delete(tasks).where(eq(tasks.id, id)).returning(taskSelectObj);
    return res[0] || null;
  }
}
