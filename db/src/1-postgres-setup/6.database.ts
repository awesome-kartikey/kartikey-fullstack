import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface User {
  id: number;
  email: string;
  created_at: Date;
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  user_id: number | null;
}

export async function getUser(id: number): Promise<User | null> {
  try {
    const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0] || null;
  } catch (err) {
    console.error("Error fetching user:", err);
    throw err;
  }
}

export async function createTask(userId: number, title: string): Promise<Task> {
  try {
    const res = await pool.query(
      "INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *",
      [title, userId],
    );
    return res.rows[0];
  } catch (err) {
    console.error("Error creating task:", err);
    throw err;
  }
}

export async function getUserTasks(userId: number): Promise<Task[]> {
  try {
    const res = await pool.query("SELECT * FROM tasks WHERE user_id = $1", [
      userId,
    ]);
    return res.rows;
  } catch (err) {
    console.error("Error fetching user tasks:", err);
    throw err;
  }
}

export async function closeDb() {
  await pool.end();
}

process.on("SIGINT", async () => {
  await closeDb();
  process.exit(0);
});
