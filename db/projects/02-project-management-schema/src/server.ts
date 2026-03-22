import express from "express";
import { ProjectRepository } from "./repositories/ProjectRepository.js";
import { TaskRepository } from "./repositories/TaskRepository.js";
import { CommentRepository } from "./repositories/CommentRepository.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { TagRepository } from "./repositories/TagRepository.js";
import { pool } from "./database.js";

const app = express();
app.use(express.json());

// Create User
app.post("/users", async (req, res) => {
  try {
    const { name, email, preferences } = req.body;
    const user = await UserRepository.create(name, email, preferences);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Create Tag
app.post("/tags", async (req, res) => {
  try {
    const { name } = req.body;
    const tag = await TagRepository.create(name);
    res.status(201).json(tag);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Create Project
app.post("/projects", async (req, res) => {
  try {
    const { name, ownerId, metadata } = req.body;
    const project = await ProjectRepository.create(name, ownerId, metadata);
    res.status(201).json(project);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Create Task
app.post("/tasks", async (req, res) => {
  try {
    const { title, projectId, assignedTo, tagIds } = req.body;
    const task = await TaskRepository.create(title, projectId, assignedTo);

    if (tagIds && tagIds.length > 0) {
      await TaskRepository.assignTags(task.id, tagIds);
    }

    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Add Threaded Comment
app.post("/comments", async (req, res) => {
  try {
    const { taskId, authorId, content, parentCommentId } = req.body;
    const comment = await CommentRepository.create(
      taskId,
      authorId,
      content,
      parentCommentId,
    );
    res.status(201).json(comment);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(`Project API running on port ${PORT}`),
);

process.on("SIGINT", async () => {
  server.close();
  await pool.end();
  process.exit(0);
});
