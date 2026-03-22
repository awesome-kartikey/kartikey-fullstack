import { pool } from "../database.js";

export class CommentRepository {
  static async create(
    taskId: number,
    authorId: number,
    content: string,
    parentCommentId?: number,
  ) {
    const res = await pool.query(
      "INSERT INTO comments (task_id, author_id, content, parent_comment_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [taskId, authorId, content, parentCommentId || null],
    );
    return res.rows[0];
  }
}
