import express from "express";
import { Queue, Worker, Job } from "bullmq";
import Redis from "ioredis";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

export const app = express();
app.use(express.json());

const redis = new Redis({ maxRetriesPerRequest: null });

export const emailQueue = new Queue("EmailQueue", { connection: redis as any });

app.post("/send", async (req, res) => {
  const { email, orderId } = req.body;
  await emailQueue.add(
    "send-email", 
    { email }, 
    { 
      jobId: `welcome-email-${orderId}`, 
      attempts: 3, 
      backoff: { type: "exponential", delay: 1000 }
    }
  );
  res.sendStatus(202);
});

export const emailWorker = new Worker("EmailQueue", async (job: Job) => {
  console.log(`[${new Date().toISOString()}] Job ${job.id} Attempt ${job.attemptsMade + 1}`);
  if (job.data.email === "fail@test.com") {
    throw new Error("Simulated failure to trigger retry");
  }
  console.log(`Sent to ${job.data.email}`);
}, { connection: redis as any });

export const cronQueue = new Queue("CronQueue", { connection: redis as any });

export async function setupCron() {
  await cronQueue.add("sync-weather", {}, {
    repeat: { pattern: "* * * * *" },
    jobId: "weather-sync" 
  });
}

export const cronWorker = new Worker("CronQueue", async () => {
  const start = Date.now();
  console.log("Fetching weather...");
  console.log(`Weather sync completed in ${Date.now() - start}ms`);
}, { connection: redis as any });

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");
createBullBoard({ 
  queues: [new BullMQAdapter(emailQueue), new BullMQAdapter(cronQueue)], 
  serverAdapter 
});
app.use("/admin/queues", serverAdapter.getRouter());

if (require.main === module) {
  setupCron();
  app.listen(3002, () => console.log("Redis queues running on port 3002. View UI at http://localhost:3002/admin/queues"));
}
