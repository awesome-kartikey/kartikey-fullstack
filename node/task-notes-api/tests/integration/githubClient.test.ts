import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { http, HttpResponse, delay } from "msw";
import { setupServer } from "msw/node";
import { GithubClient } from "../../src/integrations/githubClient.js";

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe("GithubClient", () => {
  // Use faster timeouts for tests
  const client = new GithubClient("https://api.github.com", 100, 2);

  it("returns user on success", async () => {
    server.use(
      http.get("https://api.github.com/users/octocat", () => {
        return HttpResponse.json({ login: "octocat", id: 1, name: "The Octocat" });
      })
    );

    const user = await client.getUser("octocat");
    expect(user.login).toBe("octocat");
    expect(user.id).toBe(1);
  });

  it("throws after retries on 500", async () => {
    let attempts = 0;
    server.use(
      http.get("https://api.github.com/users/erroruser", () => {
        attempts++;
        return new HttpResponse(null, { status: 500 });
      })
    );

    await expect(client.getUser("erroruser")).rejects.toThrow("GitHub API Error: 500");
    expect(attempts).toBe(3); // 1 initial + 2 retries
  });

  it("handles timeout correctly using AbortController", async () => {
    let attempts = 0;
    server.use(
      http.get("https://api.github.com/users/timeoutuser", async () => {
        attempts++;
        await delay(150); // longer than the 100ms timeout
        return HttpResponse.json({ login: "timeout" });
      })
    );

    await expect(client.getUser("timeoutuser")).rejects.toThrow();
    expect(attempts).toBe(3); // 1 initial + 2 retries
  });

  it("handles invalid JSON responses", async () => {
    server.use(
      http.get("https://api.github.com/users/badjson", () => {
        return new HttpResponse("Not JSON", { status: 200, headers: { "Content-Type": "text/plain" } });
      })
    );

    await expect(client.getUser("badjson")).rejects.toThrow();
  });
});
