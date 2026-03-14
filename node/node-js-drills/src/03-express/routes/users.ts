// Add a route with a path parameter /users/:id.
// Extract req.params.id and return it in JSON.
// Add query parameter handling (/search?q=hello).
// Create a route that accepts both params and query: /users/:id/posts?limit=10.
// Add a wildcard route * that returns 404.

import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`UserRouter -- ${req.method} ${req.url}`);
  next();
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  res.json({ id });
});

router.get("/users/:id/posts", (req, res) => {
  const { id } = req.params;
  const limit = Number(req.query.limit) || 10;
  res.json({ userId: id, limit });
});

export default router;
