// Boundary validation: Accept a JSON payload representing a user. Validate with a Zod schema and map validation failures to stable error codes. Show both valid and invalid input runs.

import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(18),
});

function validateUser(input: unknown) {
  const result = UserSchema.safeParse(input);

  if (!result.success) {
    return {
      code: "E_INVALID_DATA",
      errors: result.error.message,
    };
  }

  return { code: "SUCCESS", data: result.data };
}

console.log("Valid run:", validateUser({ name: "Kartikey", age: 25, email: "k@test.com" }));
console.log("Invalid run:", validateUser({ name: "Poo", age: 10 }));
