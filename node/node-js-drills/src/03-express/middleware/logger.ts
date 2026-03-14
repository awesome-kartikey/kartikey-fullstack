import { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";

// Add middleware that logs method and url for every request.
// Add middleware that times requests and logs duration.
// Add middleware that adds a requestId to each request.

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  (req as any).requestId = randomUUID();
  const startTime = Date.now();
  console.log(`--- ${(req as any).requestId} ${req.method} ${req.url}`);

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    console.log(
      `--- ${(req as any).requestId} ${req.method}  ${res.statusCode} ${req.url} ${duration}ms`,
    );
  });

  next();
}
