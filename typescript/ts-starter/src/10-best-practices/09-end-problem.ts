import { z } from "zod";
import pino from "pino";
import debug from "debug";
import { EventEmitter } from "events";

const logger = pino();
const trace = debug("app:user-profile");

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3),
  email: z.string().email(),
});

type UserProfile = z.infer<typeof UserProfileSchema>;
type Result<T> = { success: true; data: T } | { success: false; error: string };

class UserProfileModule {
  private db = new Map<string, UserProfile>();
  public events = new EventEmitter();

  createUser(input: unknown): Result<UserProfile> {
    trace("Validating new user input", input);

    const parsed = UserProfileSchema.safeParse(input);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
      logger.warn({ errorMsg }, "User creation validation failed");
      return { success: false, error: errorMsg };
    }

    const user = parsed.data;
    this.db.set(user.id, user);

    logger.info({ userId: user.id }, "User successfully created");
    this.events.emit("userCreated", user);

    return { success: true, data: user };
  }
}

const module = new UserProfileModule();
module.events.on("userCreated", (u) => console.log("Event caught! New user:", u.username));

module.createUser({
  id: "123e4567-e89b-12d3-a456-426614174000",
  username: "Kartikey",
  email: "kartikey@example.com",
});
