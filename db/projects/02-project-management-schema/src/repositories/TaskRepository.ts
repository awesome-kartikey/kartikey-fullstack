import { pool } from "../database.js";
import { ProjectRepository } from "./ProjectRepository.js";

export class TaskRepository {
  static async create(title: string, projectId: number, assignedTo: number) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN"); // Start Transaction

      const res = await client.query(
        "INSERT INTO tasks (title, project_id, assigned_to) VALUES ($1, $2, $3) RETURNING *",
        [title, projectId, assignedTo],
      );

      await client.query(
        "UPDATE projects SET task_count = task_count + 1 WHERE id = $1",
        [projectId],
      );

      await client.query("COMMIT");
      return res.rows[0];
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  static async assignTags(taskId: number, tagIds: number[]) {
    for (const tagId of tagIds) {
      await pool.query(
        "INSERT INTO task_tags (task_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [taskId, tagId],
      );
    }
  }
}
