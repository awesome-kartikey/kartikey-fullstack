import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import pg from "pg";
import { app } from "./server";

vi.mock("pg", () => {
  const queryMock = vi.fn().mockResolvedValue({ rows: [] });
  return {
    default: { Pool: vi.fn(() => ({ query: queryMock, end: vi.fn() })) },
  };
});

describe("Observability Endpoints", () => {
  it("GET /healthz returns 200", async () => {
    const res = await request(app).get("/healthz");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "alive" });
  });

  it("GET /readyz returns 200 when DB connected", async () => {
    const res = await request(app).get("/readyz");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ready" });
  });

  it("GET /readyz returns 503 when DB down", async () => {
    const pool = new pg.Pool();
    vi.mocked(pool.query).mockRejectedValueOnce(new Error("Connection refused"));

    const res = await request(app).get("/readyz");
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ status: "unready" });
  });

  it("GET /metrics increments and exposes counters", async () => {
    await request(app).get("/healthz");
    
    const res = await request(app).get("/metrics");
    expect(res.status).toBe(200);
    expect(res.text).toContain("http_requests_total");
    expect(res.text).toContain('route="/healthz"');
  });
});
