import logger from "../logger.js";

export interface GithubUser {
  login: string;
  id: number;
  name: string | null;
}

export class GithubClient {
  constructor(
    private baseUrl = "https://api.github.com",
    private timeoutMs = 5000,
    private maxRetries = 3
  ) { }

  async getUser(username: string): Promise<GithubUser> {
    const url = `${this.baseUrl}/users/${username}`;
    let attempt = 0;

    while (attempt <= this.maxRetries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`GitHub API Error: ${res.status}`);
        }

        const data = await res.json();
        return data as GithubUser;
      } catch (err: unknown) {
        attempt++;
        if (attempt > this.maxRetries) {
          logger.error({ err }, `GitHub client failed after ${this.maxRetries} retries`);
          throw err;
        }

        const backoff = Math.pow(2, attempt) * 100 + Math.random() * 50;
        await new Promise(r => setTimeout(r, backoff));
      }
    }
    throw new Error("Unreachable");
  }
}
