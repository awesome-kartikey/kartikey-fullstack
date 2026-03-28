import express from "express";
import { Queue, Worker } from "bullmq";
import Database from "better-sqlite3";

const app = express();
app.use(express.json());
const db = new Database(":memory:");
db.exec("CREATE TABLE jobs (id TEXT PRIMARY KEY, status TEXT)");

const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
};

// 1. Queue Setup
const reportQueue = new Queue("reports", { connection: redisConnection });

// 2. Worker Setup
const worker = new Worker(
  "reports",
  async (job) => {
    db.prepare("UPDATE jobs SET status = ? WHERE id = ?").run(
      "running",
      job.id,
    );
    await new Promise((r) => setTimeout(r, 2000)); // Simulate work
    db.prepare("UPDATE jobs SET status = ? WHERE id = ?").run(
      "complete",
      job.id,
    );
  },
  { connection: redisConnection },
);

// 3. API Endpoints
app.post("/submit-report", async (req, res) => {
  const job = await reportQueue.add("generate-pdf", {
    userId: req.body.userId,
  });
  db.prepare("INSERT INTO jobs (id, status) VALUES (?, ?)").run(
    job.id,
    "pending",
  );
  res.status(202).json({ jobId: job.id, status: "pending" });
});

app.get("/jobs/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM jobs WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
});

// Graceful Shutdown
const shutdown = async () => {
  await worker.close();
  await reportQueue.close();
  db.close();
  process.exit(0);
};
process.on("SIGINT", shutdown);

app.listen(3000, () => console.log("Job Service running"));
