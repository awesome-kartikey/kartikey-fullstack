import { Router } from "express";
import { nanoid } from "nanoid";
import { taskStore } from "../store.js";
import type { Task } from "../store.js";
import { validate } from "../middleware/validate.js";
import { CreateTaskSchema, TaskQuerySchema } from "../schemas.js";
import type { CreateTaskInput, TaskQuery } from "../schemas.js";
import type { PaginatedResponse } from "../types.js";
import { createProblem } from "../lib/problem.js";
import { logger } from "../lib/logger.js";
import { asyncHandler } from "../lib/asyncHandler.js";

export const tasksRouter = Router();

tasksRouter.get("/", validate(TaskQuerySchema, "query"), (req, res) => {
  const { page, limit, completed, sort, order } =
    req.query as unknown as TaskQuery;

  let tasks = Array.from(taskStore.values());

  if (completed !== undefined) {
    const wantCompleted = completed === "true";
    tasks = tasks.filter((t) => t.completed === wantCompleted);
  }

  tasks.sort((a, b) => {
    let comparison = 0;
    if (sort === "title") {
      if (a.title < b.title) comparison = -1;
      else if (a.title > b.title) comparison = 1;
    } else {
      if (a.createdAt < b.createdAt) comparison = -1;
      else if (a.createdAt > b.createdAt) comparison = 1;
    }
    if (order === "desc") comparison = comparison * -1;
    return comparison;
  });

  const total = tasks.length;
  const start = (page - 1) * limit;
  const data = tasks.slice(start, start + limit);

  const response: PaginatedResponse<Task> = {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
  res.json(response);
});

tasksRouter.post("/", validate(CreateTaskSchema, "body"), (req, res) => {
  const input = req.body as CreateTaskInput;

  const task: Task = {
    id: nanoid(),
    title: input.title,
    completed: input.completed ?? false,
    createdAt: new Date().toISOString(),
  };

  taskStore.set(task.id, task);
  logger.info({ requestId: req.requestId, taskId: task.id }, "task created");
  res.status(201).json({ data: task });
});

tasksRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const taskId = req.params.id as string;
    const task = taskStore.get(taskId);

    if (!task) {
      const problem = createProblem(
        404,
        "Task Not Found",
        `No task exists with id ${taskId}`,
        req.path,
      );
      res.status(404).json(problem);
      return;
    }

    res.json({ data: task });
  }),
);

tasksRouter.put("/:id",validate(CreateTaskSchema,"body"), (req, res) => {
  const taskId = req.params.id as string;
  const existing = taskStore.get(taskId);

  if (!existing) {
    const problem = createProblem(
      404,
      "Task Not Found",
      `No task exists with id ${taskId}`,
      req.path,
    );
    res.status(404).json(problem);
    return;
  }

  const updated: Task = {
    ...existing,
    title: req.body.title ?? existing.title,
    completed: req.body.completed ?? existing.completed,
  };

  taskStore.set(updated.id, updated);
  logger.info({ requestId: req.requestId, taskId: updated.id }, "task updated");
  res.json({ data: updated });
});

tasksRouter.delete("/:id", (req, res) => {
  const taskId = req.params.id as string;
  const exists = taskStore.has(taskId);

  if (!exists) {
    const problem = createProblem(
      404,
      "Task Not Found",
      `No task exists with id ${taskId}`,
      req.path,
    );
    res.status(404).json(problem);
    return;
  }

  taskStore.delete(taskId);
  logger.info({ requestId: req.requestId, taskId }, "task deleted");
  res.status(204).send();
});
