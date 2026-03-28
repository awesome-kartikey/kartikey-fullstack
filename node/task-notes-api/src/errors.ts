import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import logger from "./logger.js";

export class AppError extends Error {
  status: number;
  type: string;
  detail: string;
  extras?: Record<string, unknown>;

  constructor(status: number, title: string, detail: string, type = "about:blank", extras?: Record<string, unknown>) {
    super(title);
    this.status = status;
    this.type = type;
    this.detail = detail;
    this.extras = extras;
  }
}

export const badRequest = (detail: string, extras?: Record<string, unknown>) =>
  new AppError(400, "Bad Request", detail, "https://example.com/problems/bad-request", extras);

export const unauthorized = (detail = "Authentication required") =>
  new AppError(401, "Unauthorized", detail, "https://example.com/problems/unauthorized");

export const forbidden = (detail = "Forbidden") =>
  new AppError(403, "Forbidden", detail, "https://example.com/problems/forbidden");

export const notFound = (detail = "Resource not found") =>
  new AppError(404, "Not Found", detail, "https://example.com/problems/not-found");

export const conflict = (detail: string) =>
  new AppError(409, "Conflict", detail, "https://example.com/problems/conflict");

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  logger.error({ err }, "Unhandled error");

  if (err instanceof ZodError) {
    return res.status(400).type("application/problem+json").json({
      type: "https://example.com/problems/validation",
      title: "Validation Error",
      status: 400,
      detail: "Request validation failed",
      errors: err.issues
    });
  }

  const pgCode = (err as any).code;
  if (pgCode === "23505") {
    return res.status(409).type("application/problem+json").json({
      type: "https://example.com/problems/conflict",
      title: "Conflict",
      status: 409,
      detail: "A record with that value already exists"
    });
  }
  if (pgCode === "23503") {
    return res.status(400).type("application/problem+json").json({
      type: "https://example.com/problems/bad-request",
      title: "Bad Request",
      status: 400,
      detail: "The user you are trying to assign this task to doesn't exist"
    });
  }
  if (pgCode === "23514") {
    return res.status(400).type("application/problem+json").json({
      type: "https://example.com/problems/bad-request",
      title: "Validation Error",
      status: 400,
      detail: "Database check constraint failed"
    });
  }

  if (err instanceof AppError) {
    return res.status(err.status).type("application/problem+json").json({
      type: err.type,
      title: err.message,
      status: err.status,
      detail: err.detail,
      ...(err.extras || {})
    });
  }

  return res.status(500).type("application/problem+json").json({
    type: "https://example.com/problems/internal",
    title: "Internal Server Error",
    status: 500,
    detail: "Unexpected server error"
  });
}
