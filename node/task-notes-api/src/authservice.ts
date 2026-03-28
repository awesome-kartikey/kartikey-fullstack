import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "./config.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { conflict, unauthorized } from "./errors.js";
import { withTransaction } from "./database.js";
import { users, tasks } from "./db/schema.js";
import { nanoid } from "nanoid";

export type JWTPayload = {
  userId: number;
  email: string;
  role: "user" | "admin";
};

export class AuthService {
  constructor(private users: UserRepository) {}

  async register(email: string, password: string) {
    const existing = await this.users.getUserByEmail(email);
    if (existing) throw conflict("Email already exists");

    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await withTransaction(async (tx) => {
      const [u] = await tx.insert(users).values({
        email,
        password_hash: passwordHash,
        role: "user"
      }).returning();

      await tx.insert(tasks).values({
        id: nanoid(),
        user_id: u.id,
        title: "Welcome to TaskNotes!",
        description: "This is your starter task.",
        priority: "medium"
      });

      return u;
    });
    const payload: JWTPayload = { userId: user.id, email: user.email, role: user.role as "user" | "admin" };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: "7d" });

    return { 
      token, 
      refreshToken, 
      user: { id: user.id, email: user.email, role: user.role, name: null, createdAt: user.created_at } 
    };
  }

  async login(email: string, password: string) {
    const user = await this.users.getUserByEmail(email);
    if (!user) throw unauthorized("Invalid credentials");

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw unauthorized("Invalid credentials");

    const payload: JWTPayload = { userId: user.id, email: user.email, role: user.role as "user" | "admin" };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: "7d" });

    return { 
      token, 
      refreshToken, 
      user: { id: user.id, email: user.email, role: user.role, name: null, createdAt: user.created_at } 
    };
  }

  verifyAccess(token: string) {
    return jwt.verify(token, config.jwtSecret) as JWTPayload;
  }

  verifyRefresh(token: string) {
    return jwt.verify(token, config.jwtRefreshSecret) as JWTPayload;
  }

  refresh(refreshToken: string) {
    const payload = this.verifyRefresh(refreshToken);
    const nextPayload: JWTPayload = { userId: payload.userId, email: payload.email, role: payload.role };
    return {
      token: jwt.sign(nextPayload, config.jwtSecret, { expiresIn: "15m" }),
      refreshToken: jwt.sign(nextPayload, config.jwtRefreshSecret, { expiresIn: "7d" })
    };
  }
}
