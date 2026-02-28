import { z } from "zod";
const User = z.object({ id: z.string(), email: z.string().email(), createdAt: z.coerce.date() });
const data = User.parse({ id: "u1", email: "a@b.com", createdAt: "2024-01-01" });
