import { Counter, Histogram, Registry, collectDefaultMetrics } from "prom-client";
import type { NextFunction, Request, Response } from "express";

export const register = new Registry();
collectDefaultMetrics({ register });

export const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register]
});

export const httpRequestDurationMs = new Histogram({
  name: "http_request_duration_ms",
  help: "HTTP request duration in ms",
  labelNames: ["method", "route", "status_code"],
  buckets: [5, 15, 50, 100, 250, 500, 1000, 2000],
  registers: [register]
});

export const httpErrorsTotal = new Counter({
  name: "http_errors_total",
  help: "Total HTTP errors",
  labelNames: ["method", "route", "status_code"],
  registers: [register]
});

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on("finish", () => {
    const route = req.route?.path || req.path || "unknown";
    const status = String(res.statusCode);
    httpRequestsTotal.inc({ method: req.method, route, status_code: status });
    httpRequestDurationMs.observe({ method: req.method, route, status_code: status }, Date.now() - start);
    if (res.statusCode >= 400) httpErrorsTotal.inc({ method: req.method, route, status_code: status });
  });
  next();
}
