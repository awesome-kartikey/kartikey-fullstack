// Boundary validation: Accept a JSON payload representing a user. Validate with a Zod schema and map validation failures to stable error codes. Show both valid and invalid input runs.

import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(18),
});

function validateUser(user: unknown): void {
  const parsed = userSchema.safeParse(user);
}
