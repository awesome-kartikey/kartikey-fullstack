import { Router } from "express";
import { z } from "zod";
import { AuthService } from "../authservice.js";
import { validateBody } from "../middleware/validate.js";

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const RefreshSchema = z.object({
  refreshToken: z.string().min(1)
});

export function createAuthRouter(authService: AuthService) {
  const router = Router();

  router.post("/register", validateBody(AuthSchema), async (req, res, next) => {
    try {
      const user = await authService.register(req.body.email, req.body.password);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  });

  router.post("/login", validateBody(AuthSchema), async (req, res, next) => {
    try {
      const tokens = await authService.login(req.body.email, req.body.password);
      res.json(tokens);
    } catch (err) {
      next(err);
    }
  });

  router.post("/refresh", validateBody(RefreshSchema), async (req, res, next) => {
    try {
      const tokens = authService.refresh(req.body.refreshToken);
      res.json(tokens);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
