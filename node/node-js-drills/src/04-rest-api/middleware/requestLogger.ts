import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger.js";
import { metrics } from "../lib/metrics.js";

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusGroup = `${Math.floor(res.statusCode / 100)}xx`;

    metrics.increment(`requests.${req.method}.${req.path}`);
    metrics.increment(`responses.${statusGroup}`);
    metrics.recordLatency(req.path, duration);

    logger.info(
      {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        status: res.statusCode,
        durationMs: duration,
      },
      "request completed",
    );
  });

  next();
}
