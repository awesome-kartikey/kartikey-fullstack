import { nanoid } from "nanoid";

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3,
): Promise<any> {
  const requestId = nanoid();
  const start = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const headers = new Headers(options.headers);
  headers.set("X-Request-ID", requestId);
  headers.set("Authorization", `Bearer ${process.env.API_KEY}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    console.log(`[${requestId}] ${response.status} ${Date.now() - start}ms`);

    if (!response.ok) {
      if (response.status >= 500 && retries > 0) {
        await new Promise((r) => setTimeout(r, 1000));
        return fetchWithRetry(url, options, retries - 1);
      }
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return response.json();
  } catch (error: any) {
    if (error.name === "AbortError") throw new Error("Request Timeout");
    throw error;
  }
}
