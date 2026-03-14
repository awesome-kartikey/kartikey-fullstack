import type { Request, Response, NextFunction } from "express";
import { nanoid } from "nanoid";

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

export function requestId(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const id = (req.headers["x-request-id"] as string) ?? nanoid(10);
  req.requestId = id;
  res.setHeader("x-request-id", id);
  next();
}
