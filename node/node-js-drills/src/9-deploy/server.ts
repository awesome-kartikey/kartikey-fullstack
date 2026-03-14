import express from "express";
import http from "http";

const app = express();
const PORT = process.env.PORT || 3000;

// Drill 1: Log environment
console.log(`Running in ${process.env.NODE_ENV || "development"} mode`);

// Drill 4: Log process PID to prove cluster distribution
app.get("/", (req, res) => {
  res.send(`Handled by Worker PID: ${process.pid}`);
});

// Drill 5: Blocking CPU task (DO NOT do this in production!)
app.get("/fib-block", (req, res) => {
  const fib = (n: number): number => (n <= 1 ? n : fib(n - 1) + fib(n - 2));
  const result = fib(40);
  res.json({ result, pid: process.pid });
});

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server listening on port ${PORT} | PID: ${process.pid}`));

// Drill 2: Graceful Shutdown Logic
const shutdown = (signal: string) => {
  console.log(`\n[${signal}] Received. Shutting down gracefully...`);
  
  server.close(() => {
    console.log("Safe to exit. All active HTTP connections closed.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forcing shutdown due to timeout.");
    process.exit(1);
  }, 10000).unref(); 
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
