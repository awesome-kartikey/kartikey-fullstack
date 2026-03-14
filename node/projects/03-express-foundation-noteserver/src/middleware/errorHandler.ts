import { Request, Response, NextFunction } from "express";
import logger from "../lib/logger";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: "NotFound",
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const isDev = process.env.NODE_ENV !== "production";

  if (
    err instanceof SyntaxError &&
    (err as any).type === "entity.parse.failed"
  ) {
    return res.status(400).json({
      error: "BadRequest",
      message: "Malformed JSON in request body",
    });
  }

  logger.error(
    {
      requestId: (req as any).requestId ?? "unknown",
      method: req.method,
      url: req.originalUrl,
      err: err.message,
    },
    "Unhandled error",
  );

  res.status(err.statusCode || 500).json({
    error: err.name || "InternalServerError",
    message: isDev ? err.message : "An unexpected error occurred",
    ...(isDev && { stack: err.stack }),
  });
}
