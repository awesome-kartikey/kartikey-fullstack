import { pool } from "../database.js";

export class ProjectRepository {
  static async create(name: string, ownerId: number, metadata: object = {}) {
    const res = await pool.query(
      "INSERT INTO projects (name, owner_id, metadata) VALUES ($1, $2, $3) RETURNING *",
      [name, ownerId, metadata],
    );
    return res.rows[0];
  }

  static async incrementTaskCount(projectId: number) {
    await pool.query(
      "UPDATE projects SET task_count = task_count + 1 WHERE id = $1",
      [projectId],
    );
  }
}
