import express, { Request, Response, NextFunction } from "express";
import { nanoid } from "nanoid";

export const app = express();
app.use(express.json());

// Drill 4 & 5: Generate request ID and attach to context
app.use((req, res, next) => {
  req.headers["x-request-id"] = nanoid(8);
  next();
});

app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

// Drill 5: RFC 7807 Error Handler
export function rfc7807Handler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const status = err.status || 500;
  const requestId = req.headers["x-request-id"];

  console.error(`[${requestId}] Error:`, err.message); // Drill 5: Logs contain request IDs

  res.status(status).json({
    type: err.type || "about:blank",
    title: err.title || "Internal Server Error",
    status: status,
    detail: err.message,
    instance: req.originalUrl,
    requestId,
  });
}

app.use(rfc7807Handler);
