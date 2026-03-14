import { Request, Response, NextFunction } from "express";
import { nanoid } from "nanoid";
import logger from "../lib/logger";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  (req as any).requestId = nanoid();
  const startTime = Date.now();

  logger.info(
    {
      requestId: (req as any).requestId,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
    },
    "incoming",
  );

  res.on("finish", () => {
    const durationMs = Date.now() - startTime;

    const level =
      res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";

    logger[level](
      {
        requestId: (req as any).requestId,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        durationMs,
      },
      "completed",
    );
  });

  next();
}
