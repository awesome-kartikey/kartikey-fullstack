import express, { Request, Response, NextFunction } from "express";
import Database from "better-sqlite3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import "dotenv/config";

const app = express();
const db = new Database(process.env.DB_PATH || "./data.db");
const JWT_SECRET = process.env.JWT_SECRET!;

// DB Init
db.exec(
  `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT, role TEXT)`,
);
db.exec(
  `CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, userId INTEGER, title TEXT)`,
);

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many requests" },
});

// Auth Routes
app.post("/api/auth/register", limiter, async (req, res) => {
  const { email, password, role = "user" } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const info = db
      .prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)")
      .run(email, hash, role);
    res.status(201).json({ id: info.lastInsertRowid, email, role });
  } catch {
    res.status(400).json({ error: "Email already exists" });
  }
});

app.post("/api/auth/login", limiter, async (req, res) => {
  const { email, password } = req.body;
  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email) as any;
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// Middleware to Protect Routes
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    (req as any).user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Protected Route
app.get("/api/tasks", requireAuth, (req, res) => {
  const user = (req as any).user;
  if (user.role === "admin") {
    res.json(db.prepare("SELECT * FROM tasks").all());
  } else {
    res.json(
      db.prepare("SELECT * FROM tasks WHERE userId = ?").all(user.userId),
    );
  }
});

process.on("SIGINT", () => {
  db.close();
  process.exit();
});
app.listen(process.env.PORT || 3000, () => console.log("Secure API running"));
