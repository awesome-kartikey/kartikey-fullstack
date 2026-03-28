import { Router } from "express";
import { z } from "zod";
import { UserRepository } from "../repositories/UserRepository.js";
import { AuthService } from "../authservice.js";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth.js";
import { badRequest, notFound } from "../errors.js";
import { validateBody } from "../middleware/validate.js";

const UpdateProfileSchema = z.object({
  email: z.string().email()
});

export function createUserRouter(users: UserRepository, authService: AuthService) {
  const router = Router();
  const auth = requireAuth(authService);

  router.use(auth);

  router.get("/profile", async (req, res, next) => {
    try {
      const actor = (req as AuthRequest).user;
      const user = await users.getUserById(actor.userId);
      if (!user) throw notFound("User not found");
      res.json(user);
    } catch (err) {
      next(err);
    }
  });

  router.put("/profile", validateBody(UpdateProfileSchema), async (req, res, next) => {
    try {
      const actor = (req as AuthRequest).user;
      const updated = await users.updateProfile(actor.userId, req.body.email);
      if (!updated) throw notFound("User not found");
      res.json(updated);
    } catch (err) {
      next(err);
    }
  });

  router.get("/", requireRole("admin"), async (req, res, next) => {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      const q = typeof req.query.q === "string" ? req.query.q : undefined;
      const result = await users.listUsers(page, limit, q);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
