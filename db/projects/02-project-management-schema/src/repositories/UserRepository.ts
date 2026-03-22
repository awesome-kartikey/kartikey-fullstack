import { pool } from "../database.js";

export class UserRepository {
    static async create(name: string, email: string, preferences?: object) {
        const res = await pool.query(
            "INSERT INTO users (name, email, preferences) VALUES ($1, $2, COALESCE($3, '{\"theme\": \"light\", \"notifications\": true}'::jsonb)) RETURNING *",
            [name, email, preferences || null]
        );
        return res.rows[0];
    }
}
