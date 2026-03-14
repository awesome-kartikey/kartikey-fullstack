import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User, UserDatabase } from "../database";

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export class AuthService {
  constructor(
    private userDb: UserDatabase,
    private jwtSecret: string,
  ) {}

  async register(
    email: string,
    password: string,
  ): Promise<Omit<User, "password_hash">> {
    const hash = await bcrypt.hash(password, 10);
    const user = this.userDb.createUser(email, hash);
    const { password_hash, ...safe } = user;
    return safe as any;
  }

  async login(email: string, password: string): Promise<string> {
    const user = this.userDb.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new Error("Invalid credentials");
    }
    return jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      this.jwtSecret,
      { expiresIn: "24h" },
    );
  }

  verifyToken(token: string): JWTPayload {
    return jwt.verify(token, this.jwtSecret) as JWTPayload;
  }
}
