import { BaseRepository } from "./BaseRepository.js";

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: Date;
}

export class UserRepository extends BaseRepository<User> {
  constructor(client?: any) {
    super("users", client);
  }

  async create(email: string, name: string): Promise<User> {
    const res = await this.execute(
      "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *",
      [email, name],
    );
    return res.rows[0];
  }

  async findAll(limit: number = 10, offset: number = 0): Promise<User[]> {
    const res = await this.execute(
      "SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset],
    );
    return res.rows;
  }
}
