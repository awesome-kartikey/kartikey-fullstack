import { pool } from "../database";

export class TaskRepository {
  static async create(title: string, userId: number) {
    const res = await pool.query(
      "INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *",
      [title, userId],
    );
    return res.rows[0];
  }

  static async findByUser(userId: number) {
    const res = await pool.query("SELECT * FROM tasks WHERE user_id = $1", [
      userId,
    ]);
    return res.rows;
  }
}
