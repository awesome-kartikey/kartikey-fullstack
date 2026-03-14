// Call it from Express without blocking the event loop.
// Pass messages between main and worker thread.
// Handle worker errors cleanly.
// Benchmark latency with and without worker thread.
import { Worker } from "worker_threads";
import express from "express";

const app = express();

app.get("/fib-threaded", (req, res) => {
  const start = Date.now(); // 5. Benchmark latency
  const worker = new Worker("./fibonacci.ts", {
    workerData: { n: 40 },
    execArgv: ["--import", "tsx"]
  });

  // 3. Pass messages between main and worker thread.
  worker.on("message", (msg) => {
    if (msg.success) res.json({ result: msg.result, ms: Date.now() - start });
    else res.status(500).json({ error: msg.error });
  });
});
