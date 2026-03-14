// Write an Express route /email that enqueues a fake email job instead of sending directly.
import express from "express";

const app = express();
app.use(express.json());

// Store jobs in an in-memory queue (array).
const emailQueue: string[] = [];

app.post("/email", (req, res) => {
  emailQueue.push(req.body.email);
  res.status(202).json({ status: "queued", position: emailQueue.length });
});

// Start a worker loop that processes one job every second.
let isProcessing = false;
const processQueue = async () => {
  if (isProcessing || emailQueue.length === 0) return;

  isProcessing = true;
  const email = emailQueue.shift();

  // Log job start and completion.
  console.log(`[Job Start] Sending email to ${email}`);
  await new Promise((res) => setTimeout(res, 2000));
  console.log(`[Job Complete] Email sent to ${email}`);

  isProcessing = false;
};

const workerInterval = setInterval(processQueue, 1000);

// Add graceful shutdown: finish current job before exit.
let isShuttingDown = false;
process.on("SIGINT", () => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log("Shutting down gracefully...");

  clearInterval(workerInterval);

  const shutdownCheck = setInterval(() => {
    if (!isProcessing) {
      console.log("All active jobs finished. Exiting.");
      clearInterval(shutdownCheck);
      process.exit(0);
    }
  }, 100);
});

export { app };
