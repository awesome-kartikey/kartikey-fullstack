import { pool } from "../database.js";

export class TagRepository {
    static async create(name: string) {
        const res = await pool.query(
            "INSERT INTO tags (name) VALUES ($1) RETURNING *",
            [name]
        );
        return res.rows[0];
    }
}
