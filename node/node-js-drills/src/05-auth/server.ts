// Install bcrypt for password hashing.
// Write hashPassword(plain) and comparePassword(plain, hash).
// Create a user with hashed password in the database.
// Verify password comparison works correctly.
// Test with wrong passwords to ensure they fail.

// Add a /register route that accepts email and password.
// Hash the password and store user in the database.
// Handle duplicate email errors gracefully.
// Add a /login route that verifies credentials against database.
// Return appropriate errors for invalid credentials.

// Install jsonwebtoken.
// Update /login to return JWT with user id and role from database.
// Verify the JWT in a test route.
// Add expiration (exp) claim.
// Try expired/invalid tokens and see errors.

// Write Express middleware that checks Authorization: Bearer <token>.
// Attach decoded JWT payload to req.user.
// Protect a /profile route with the middleware.
// Return 401 if missing or invalid token.
// Add tests for protected/unprotected routes.

// Use the role from JWT payload for authorization.
// Add middleware requireRole("admin").
// Protect an /admin route with role-based check.
// Allow user role to access only /profile.
// Return 403 for unauthorized access.

// Add helmet and confirm headers in responses.
// Add CORS middleware, allow only http://localhost:3000.
// Add express-rate-limit to limit login attempts.
// Add request size limit (express.json({ limit: "1mb" })).
// Disable x-powered-by header in Express.

// Return consistent error format for auth failures.
// Log failed attempts with IP address.
// Load JWT secret from .env.
// Test brute-force attempt with rate limiting.
// Store database file outside source control.

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "./db.js";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export const app = express();

app.use(helmet());
app.disable("x-powered-by");
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json({ limit: "1mb" }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use("/login", loginLimiter);

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.post("/register", async (req, res) => {
  const email = req.body.email;
  const plainPassword = req.body.password;
  const role = req.body.role || "user";

  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const newUser = createUser(email, hashedPassword, role);

    res.status(201).json({ message: "User created!", user: newUser });
  } catch (error: any) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res.status(400).json({ error: "That email is already taken." });
    } else {
      res.status(500).json({ error: "Something went wrong." });
    }
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const plainPassword = req.body.password;

  const user = await getUserByEmail(email);

  const genericError = "Invalid email or password.";

  if (!user) {
    res.status(401).json({ error: genericError });
    return;
  }

  const isPasswordCorrect = await bcrypt.compare(
    plainPassword,
    user.password_hash,
  );

  if (!isPasswordCorrect) {
    res.status(401).json({ error: genericError });
    return;
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET as string,
    {
      expiresIn: "24h",
    },
  );

  res.json({ message: "Login successful!", token: token });
});

function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid token. Access Denied." });
  }

  // Removing the Bearer keyword from the header
  const token = authHeader.split(" ")[1];

  try {
    const decodedData = jwt.verify(token, JWT_SECRET as string);
    req.user = decodedData;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token is expired or fake." });
  }
}

app.get("/profile", requireAuth, (req: any, res: any) => {
  res.json({ message: `Welcome! Your user ID is ${req.user.userId}` });
});

app.get("/admin", requireAuth, (req: any, res: any) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "You are not an admin!" });
  }

  res.json({ message: "Welcome to the secret admin club." });
});

app.listen(3000, () => console.log("Security Server running on port 3000"));
