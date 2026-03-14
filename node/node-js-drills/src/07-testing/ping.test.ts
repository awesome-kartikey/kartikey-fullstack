import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./app.js";

describe("Basic Integration", () => {
  it("returns { ok: true } on /ping", async () => {
    const res = await request(app).get("/ping");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("fails on unknown routes to verify Vitest reporting", async () => {
    const res = await request(app).get("/not-found");
    expect(res.status).toBe(404); // Vitest will report this clearly if it fails
  });
});
