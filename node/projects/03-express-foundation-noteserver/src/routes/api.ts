import { Router } from "express";

const router = Router();

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h && `${h}h`, m && `${m}m`, `${s}s`].filter(Boolean).join(" ");
}

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

router.get("/api/info", (req, res) => {
  const mem = process.memoryUsage();
  res.json({
    name: "noteserver",
    nodeVersion: process.version,
    environment: process.env.NODE_ENV ?? "development",
    uptime: {
      seconds: Math.floor(process.uptime()),
      human: formatUptime(process.uptime()),
    },
    memory: {
      rss: `${Math.round(mem.rss / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)} MB`,
    },
    pid: process.pid,
  });
});

router.post("/api/echo", (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({
        error: "BadRequest",
        message:
          "Request body is empty or missing Content-Type: application/json",
      });
  }
  res.json({ echo: req.body, receivedAt: new Date().toISOString() });
});

export default router;
