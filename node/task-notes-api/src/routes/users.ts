import { Router } from "express";
import { UserDatabase } from "../database";
import { requireAuth } from "../middleware/auth";

export function createUserRouter(db: UserDatabase) {
  const router = Router();

  // All user routes require authentication
  router.use(requireAuth);

  // GET /api/users/profile
  router.get("/profile", (req, res) => {
    const userId = (req as any).user.userId;
    const user = db.getUserById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Never send the password hash back to the client
    const { password_hash, ...safeUser } = user;
    res.json(safeUser);
  });

  // PUT /api/users/profile
  router.put("/profile", (req, res) => {
    // Task --> update email/name here.
    res.json({ message: "Profile updated successfully (Mock)" });
  });

  return router;
}
