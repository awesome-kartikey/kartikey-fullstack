import express from "express";
import { pool, DbError } from "./db/pool.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { withTransaction } from "./db/transaction.js";
import { randomUUID } from "crypto";

const app = express();
app.use(express.json());

app.use((req: any, res, next) => {
  req.correlationId = req.headers["x-correlation-id"] || randomUUID();
  res.setHeader("x-correlation-id", req.correlationId);
  console.log(JSON.stringify({
    level: "INFO",
    msg: "Incoming Request",
    correlationId: req.correlationId,
    method: req.method,
    path: req.path,
  }));
  next();
});

// 1. Health Check Endpoint
app.get("/health/db", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    res.status(503).json({ status: "error", message: "Database unreachable" });
  }
});

// 2. User Routes utilizing the Repository
app.get("/users", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const repo = new UserRepository();
    const users = await repo.findAll(limit, offset);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const repo = new UserRepository();
    const user = await repo.create(req.body.email, req.body.name);
    res.status(201).json(user);
  } catch (err: any) {
    if (err instanceof DbError) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// 3. Transaction Example Endpoint
app.post("/users/bulk", async (req, res) => {
  const emails: string[] = req.body.emails;
  try {
    await withTransaction(async (client) => {
      const repo = new UserRepository(client);
      for (const email of emails) {
        await repo.create(email, "Name");
      }
    });
    res.status(201).json({ message: "Bulk insert successful" });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(`Production DB Layer API running on port ${PORT}`),
);

// 4. Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("\nGracefully shutting down...");
  server.close();
  await pool.end();
  process.exit(0);
});
