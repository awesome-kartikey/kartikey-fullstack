import { Router } from "express";
import { nanoid } from "nanoid";
import { FileStorage } from "../storage";
import { TaskEventEmitter } from "../events";
import { CreateTaskSchema, UpdateTaskSchema, Task } from "../models/task";
import { validateBody } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";

export function createTaskRouter(
  storage: FileStorage,
  events: TaskEventEmitter,
) {
  const router = Router();
  // router.use(requireAuth); // Protect all task routes

  router.get("/", async (req, res) => {
    const tasks = await storage.loadNotes();
    // const userTasks = tasks.filter(
    //   (t) => t.userId === (req as any).user.userId,
    // );
    // res.json(userTasks);
    res.json(tasks);
  });

  router.get("/:id", async (req, res) => {
    try {
      const tasks = await storage.loadNotes();
      const task = tasks.find((t) => t.id === req.params.id);
      if (!task) {
        res.status(404).json({ error: "Task not found" });
        return;
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.post("/", validateBody(CreateTaskSchema), async (req, res) => {
    const tasks = await storage.loadNotes();
    const newTask: Task = {
      id: nanoid(),
      // userId: (req as any).user.userId,
      userId: (req as any).user?.userId || 1,
      ...req.body,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    await storage.saveNotes(tasks);
    events.emitTaskCreated(newTask);
    res.status(201).json(newTask);
  });

  // Add PUT and DELETE logic here
  router.put("/:id", validateBody(UpdateTaskSchema), async (req, res) => {
    const tasks = await storage.loadNotes();
    const task = tasks.find((t) => t.id === req.params.id);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    const updatedTask: Task = {
      ...task,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    tasks.splice(tasks.indexOf(task), 1, updatedTask);
    await storage.saveNotes(tasks);
    events.emitTaskUpdated(updatedTask);
    res.json(updatedTask);
  });

  router.delete("/:id", async (req, res) => {
    const tasks = await storage.loadNotes();
    const task = tasks.find((t) => t.id === req.params.id);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    tasks.splice(tasks.indexOf(task), 1);
    await storage.saveNotes(tasks);
    events.emitTaskDeleted(task.id);
    res.json({ message: "Task deleted successfully" });
  });
  return router;
}
