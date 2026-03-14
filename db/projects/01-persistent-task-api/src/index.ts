import express from "express";
import { UserRepository } from "./repositories/UserRepository";
import { TaskRepository } from "./repositories/TaskRepository";
import { pool } from "./database";

const app = express();
app.use(express.json());

app.post("/users", async (req, res) => {
  try {
    const user = await UserRepository.create(req.body.email);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const task = await TaskRepository.create(req.body.title, req.body.userId);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/users/:id/tasks", async (req, res) => {
  try {
    const tasks = await TaskRepository.findByUser(Number(req.params.id));
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  await pool.end();
  server.close();
  process.exit(0);
});
