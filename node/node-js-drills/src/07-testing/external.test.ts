import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import request from "supertest";
import { setupServer } from "msw/node";
import { http, HttpResponse, delay } from "msw";
import { app } from "./app.js";
import { fetchJson } from "../06-integration/httpClient.js"; // From previous section

// --- API Route calling external service ---
app.get("/sync-data", async (req, res, next) => {
  try {
    const data = await fetchJson("https://api.thirdparty.com/data", {
      timeoutMs: 100,
    });
    res.json(data);
  } catch (err: any) {
    if (err.status === 401)
      return next({ status: 502, message: "Upstream Auth Failed" }); // Drill 4: 401 -> 502
    next({ status: 500, message: err.message });
  }
});

// --- MSW Setup ---
const server = setupServer();
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("External Services & MSW", () => {
  it("simulates 200 OK and parses correctly", async () => {
    server.use(
      http.get("https://api.thirdparty.com/data", () =>
        HttpResponse.json({ remote: true }),
      ),
    );

    const res = await request(app).get("/sync-data");
    expect(res.status).toBe(200);
    expect(res.body.remote).toBe(true);
  });

  it("simulates 401 Unauthorized and returns 502", async () => {
    server.use(
      http.get(
        "https://api.thirdparty.com/data",
        () => new HttpResponse(null, { status: 401 }),
      ),
    );

    const res = await request(app).get("/sync-data");
    expect(res.status).toBe(502);
  });

  it("simulates delayed response and triggers timeout", async () => {
    server.use(
      http.get("https://api.thirdparty.com/data", async () => {
        await delay(500);
        return HttpResponse.json({});
      }),
    );

    const res = await request(app).get("/sync-data");
    expect(res.status).toBe(500);
    expect(res.body.detail).toMatch(/timed out/);
  });

  it("simulates invalid JSON and triggers parse error", async () => {
    server.use(
      http.get(
        "https://api.thirdparty.com/data",
        () =>
          new HttpResponse("Bad Gateway <html>", {
            headers: { "Content-Type": "application/json" },
          }),
      ),
    );

    const res = await request(app).get("/sync-data");
    expect(res.status).toBe(500);
    expect(res.body.detail).toMatch(/Invalid JSON/); // Drill 5: Assert parse error
  });
});
