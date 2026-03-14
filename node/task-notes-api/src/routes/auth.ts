import { Router } from "express";
import { AuthService } from "../auth/service";

export function createAuthRouter(authService: AuthService) {
  const router = Router();

  router.post("/register", async (req, res) => {
    try {
      const user = await authService.register(
        req.body.email,
        req.body.password,
      );
      res.status(201).json(user);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const token = await authService.login(req.body.email, req.body.password);
      res.json({ token });
    } catch (e: any) {
      res.status(401).json({ error: e.message });
    }
  });

  return router;
}
