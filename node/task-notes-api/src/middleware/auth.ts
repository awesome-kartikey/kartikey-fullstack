import type { NextFunction, Request, Response } from "express";
import { AuthService, JWTPayload } from "../authservice.js";
import { forbidden, unauthorized } from "../errors.js";

export type AuthRequest = Request & { user: JWTPayload };

export function requireAuth(authService: AuthService) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const header = req.headers.authorization;
      if (!header?.startsWith("Bearer ")) throw unauthorized("Missing bearer token");
      const token = header.slice(7);
      (req as AuthRequest).user = authService.verifyAccess(token);
      next();
    } catch (err) {
      console.error("Auth middleware failure", err);
      next(unauthorized("Invalid or expired token"));
    }
  };
}

export function requireRole(role: "admin") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;
    if (!user || user.role !== role) return next(forbidden("Admin role required"));
    next();
  };
}

export function ensureOwnerOrAdmin(ownerId: number, actor: JWTPayload) {
  if (actor.role === "admin") return;
  if (actor.userId !== ownerId) throw forbidden("You do not own this task");
}
