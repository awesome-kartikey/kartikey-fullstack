import { Request, Response, NextFunction } from "express";
import { AuthService } from "../auth/service";
import { loadConfig } from "../config";
import { UserDatabase } from "../database";

const config = loadConfig();
const authService = new AuthService(
  new UserDatabase(config.dbPath),
  config.jwtSecret,
);

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    (req as any).user = authService.verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid Token" });
  }
};
