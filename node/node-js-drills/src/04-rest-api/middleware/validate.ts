import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import * as z from "zod";
import { createProblem } from "../lib/problem.js";

type Target = "body" | "query" | "params";

export function validate<T>(schema: ZodType<T>, target: Target = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const problem = createProblem(
        400,
        "Validation Error",
        "Request body failed schema validation",
        req.path,
      );
      res.status(400).json({
        ...problem,
        errors: z.treeifyError(result.error),
      });
      return;
    }

    (req as unknown as Record<string, unknown>)[target] = result.data;
    next();
  };
}
