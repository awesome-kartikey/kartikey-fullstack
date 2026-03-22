import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse, delay } from "msw";
import { fetchWithRetry } from "../src/client";

const server = setupServer(
  http.get("https://api.test/ok", () => HttpResponse.json({ success: true })),
  http.get(
    "https://api.test/500",
    () => new HttpResponse(null, { status: 500 }),
  ),
  http.get("https://api.test/timeout", async () => {
    await delay(6000);
    return HttpResponse.json({});
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("API Client", () => {
  it("returns data on success", async () => {
    const data = await fetchWithRetry("https://api.test/ok");
    expect(data.success).toBe(true);
  });

  it("retries on 500 and eventually fails", async () => {
    await expect(fetchWithRetry("https://api.test/500", {}, 1)).rejects.toThrow(
      "HTTP Error: 500",
    );
  }, 10000);

  it("throws timeout error", async () => {
    await expect(
      fetchWithRetry("https://api.test/timeout", {}, 0),
    ).rejects.toThrow("Request Timeout");
  }, 10000);
});
