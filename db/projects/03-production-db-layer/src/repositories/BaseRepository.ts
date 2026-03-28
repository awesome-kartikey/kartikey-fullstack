import { PoolClient } from "pg";
import { query } from "../db/pool.js";

export abstract class BaseRepository<T> {
  constructor(
    protected tableName: string,
    protected client?: PoolClient,
  ) { }

  protected async execute(text: string, params: any[]) {
    return this.client ? this.client.query(text, params) : query(text, params);
  }

  async findById(id: number): Promise<T | null> {
    const res = await this.execute(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id],
    );
    return res.rows[0] || null;
  }

  async delete(id: number): Promise<void> {
    await this.execute(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
  }
}
