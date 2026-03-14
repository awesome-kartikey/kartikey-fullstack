import { Request, Response, NextFunction } from "express";
//Handle malformed JSON with error response.
export function errorHandler(
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const isDev = process.env.NODE_ENV === "development";
  console.error(`[${req.method} ${req.url}] ${err.message}`);

  if (err instanceof SyntaxError) {
    res.status(400).json({ error: "Malformed JSON" });
  }

  res
    .status(err.statusCode || 500)
    .json({
      error: "Internal Server Error",
      message: isDev ? err.message : "An unexpected error occurred",
    });
}
