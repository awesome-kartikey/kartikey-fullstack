import { Router } from "express";
import { nanoid } from "nanoid";
import { AuthService } from "../authservice.js";
import { ensureOwnerOrAdmin, requireAuth, AuthRequest } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { CreateTaskSchema, UpdateTaskSchema } from "../models/task.js";
import { TaskRepository } from "../repositories/TaskRepository.js";
import { badRequest, notFound } from "../errors.js";
import logger from "../logger.js";
import { TaskScheduler } from "../jobs/scheduler.js";

export function createTaskRouter(
  tasks: TaskRepository, 
  authService: AuthService, 
  scheduler: TaskScheduler
) {
  const router = Router();
  const auth = requireAuth(authService);

  router.use(auth);

  router.get("/", async (req, res, next) => {
    try {
      const actor = (req as unknown as AuthRequest).user;
      const result = await tasks.listTasks({
        actorUserId: actor.userId,
        actorRole: actor.role,
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 10),
        priority: typeof req.query.priority === "string" ? req.query.priority : undefined,
        completed: typeof req.query.completed === "string" ? req.query.completed : undefined
      });
      res.json({ items: result.items });
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const actor = (req as unknown as AuthRequest).user;
      const task = await tasks.getTaskById(req.params.id as string);
      if (!task) throw notFound("Task not found");
      ensureOwnerOrAdmin(task.userId, actor);
      res.json(task);
    } catch (err) {
      next(err);
    }
  });

  router.post("/", validateBody(CreateTaskSchema), async (req, res, next) => {
    try {
      const actor = (req as unknown as AuthRequest).user;
      const task = await tasks.createTask({
        id: nanoid(),
        userId: actor.userId,
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority
      });
      
      logger.info({ taskId: task.id }, "Event: Task Created");

      if (req.body.dueDate) {
        await scheduler.scheduleReminder(task.id, new Date(req.body.dueDate));
      }

      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  });

  router.put("/:id", validateBody(UpdateTaskSchema), async (req, res, next) => {
    try {
      const actor = (req as unknown as AuthRequest).user;
      const existing = await tasks.getTaskById(req.params.id as string);
      if (!existing) throw notFound("Task not found");
      ensureOwnerOrAdmin(existing.userId, actor);
      
      const updated = await tasks.updateTask(req.params.id as string, req.body);
      if (updated) logger.info({ taskId: updated.id }, "Event: Task Updated");
      
      res.json(updated);
    } catch (err) {
      next(err);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      const actor = (req as unknown as AuthRequest).user;
      const existing = await tasks.getTaskById(req.params.id as string);
      if (!existing) throw notFound("Task not found");
      ensureOwnerOrAdmin(existing.userId, actor);
      
      await tasks.deleteTask(req.params.id as string);
      logger.info({ taskId: req.params.id }, "Event: Task Deleted");
      
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
}
