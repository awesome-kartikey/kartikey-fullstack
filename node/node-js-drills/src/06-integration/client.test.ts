import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse, delay } from "msw";
import { fetchJson, HttpError } from "./httpClient.js";
import { withRetry } from "./retry.js";

const server = setupServer(
  http.get("https://api.example.com/ok", () => HttpResponse.json({ success: true })),
  
  http.get("https://api.example.com/401", () => new HttpResponse(null, { status: 401 })),
  
  http.get("https://api.example.com/timeout", async () => {
    await delay(2000);
    return HttpResponse.json({});
  }),

  http.get("https://api.example.com/bad-json", () => 
    new HttpResponse("broken json", { headers: { "Content-Type": "application/json" } })
  ),

  http.get("https://api.example.com/429", () => 
    new HttpResponse(null, { status: 429, headers: { "Retry-After": "1" } })
  ),

  http.post("https://api.example.com/pay", ({ request }) => {
    if (!request.headers.has("Idempotency-Key")) {
      return new HttpResponse(null, { status: 400 });
    }
    return HttpResponse.json({ success: true }, { status: 201 });
  })
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("HTTP Client & Edge Cases", () => {
  it("handles happy path", async () => {
    const data = await fetchJson("https://api.example.com/ok");
    expect(data).toEqual({ success: true });
  });

  it("throws HttpError on 401 and does not retry", async () => {
    await expect(fetchJson("https://api.example.com/401")).rejects.toThrow(HttpError);
  });

  it("throws TimeoutError if delayed", async () => {
    await expect(fetchJson("https://api.example.com/timeout", { timeoutMs: 100 }))
      .rejects.toThrow(/timed out after/);
  });

  it("throws gracefully on invalid JSON", async () => {
    await expect(fetchJson("https://api.example.com/bad-json")).rejects.toThrow(/Invalid JSON/);
  });

  it("retries on 500 error", async () => {
    let attempts = 0;
    server.use(
      http.get("https://api.example.com/flake", () => {
        attempts++;
        return attempts < 3 ? new HttpResponse(null, { status: 500 }) : HttpResponse.json({ ok: true });
      })
    );

    const res = await withRetry(() => fetchJson("https://api.example.com/flake"), 3, 10);
    expect(attempts).toBe(3);
    expect(res).toEqual({ ok: true });
  });

  it("handles DNS failures", async () => {
    await expect(fetchJson("http://this-does-not-exist.local")).rejects.toThrow();
  });

  it("respects 429 Retry-After", async () => {
    const start = Date.now();
    await expect(withRetry(() => fetchJson("https://api.example.com/429"), 2, 10)).rejects.toThrow();
    const duration = Date.now() - start;
    
    expect(duration).toBeGreaterThanOrEqual(1000); 
  });

  it("maintains idempotency keys across requests", async () => {
    const data = await fetchJson("https://api.example.com/pay", {
      method: "POST",
      headers: { "Idempotency-Key": "order-123" }
    });
    expect(data).toEqual({ success: true });
  });
});
