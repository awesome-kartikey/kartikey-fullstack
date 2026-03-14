import { pool } from "../database";

export class UserRepository {
  static async create(email: string) {
    const res = await pool.query(
      "INSERT INTO users (email) VALUES ($1) RETURNING *",
      [email],
    );
    return res.rows[0];
  }

  static async findById(id: number) {
    const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0];
  }
}
