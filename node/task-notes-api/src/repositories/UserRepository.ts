import { eq, ilike } from "drizzle-orm";
import { db } from "../database.js";
import { users } from "../db/schema.js";

export type User = typeof users.$inferSelect;

export class UserRepository {
  async createUser(email: string, passwordHash: string, role: string = "user") {
    const res = await db.insert(users).values({
      email,
      password_hash: passwordHash,
      role
    }).returning({
      id: users.id,
      email: users.email,
      password_hash: users.password_hash,
      role: users.role,
      created_at: users.created_at
    });
    return res[0];
  }

  async getUserByEmail(email: string) {
    const res = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return res[0] || null;
  }

  async getUserById(id: number) {
    const res = await db.select({
      id: users.id,
      email: users.email,
      role: users.role,
      createdAt: users.created_at
    }).from(users).where(eq(users.id, id)).limit(1);
    return res[0] || null;
  }

  async updateProfile(id: number, email: string) {
    const res = await db.update(users)
      .set({ email })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        role: users.role,
        createdAt: users.created_at
      });
    return res[0] || null;
  }

  async listUsers(page = 1, limit = 10, q?: string) {
    const offset = (page - 1) * limit;
    
    let query = db.select({
      id: users.id,
      email: users.email,
      role: users.role,
      createdAt: users.created_at
    }).from(users);

    if (q && q.trim().length >= 2) {
      query = query.where(ilike(users.email, `%${q.trim()}%`)) as any;
    }

    const res = await query.orderBy(users.created_at).limit(limit).offset(offset);
    return res;
  }
}
