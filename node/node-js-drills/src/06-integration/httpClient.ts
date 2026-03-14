import { nanoid } from "nanoid";

export interface FetchOptions extends RequestInit {
  timeoutMs?: number;
}

export class HttpError extends Error {
  public retryAfter?: number;
  
  constructor(public status: number, message: string, public url: string, response: Response) {
    super(message);
    this.name = "HttpError";
    
    if (response.headers.has("retry-after")) {
      this.retryAfter = parseInt(response.headers.get("retry-after") || "0", 10);
    }
  }
}

export async function fetchJson<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { timeoutMs = 5000, ...fetchOpts } = options;
  const requestId = nanoid(8);
  const signal = AbortSignal.timeout(timeoutMs); 
  const start = Date.now();

  const headers = new Headers(options.headers);
  headers.set("x-request-id", requestId);
  headers.set("Accept", "application/json");

  console.log(`[REQ ${requestId}] ${options.method || "GET"} ${url}`);

  try {
    const response = await fetch(url, { ...fetchOpts, signal, headers });
    const duration = Date.now() - start;
    
    console.log(`[RES ${requestId}] Status: ${response.status} (${duration}ms)`);

    if (!response.ok) {
      throw new HttpError(response.status, `HTTP ${response.status}`, url, response);
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new Error(`Invalid JSON returned by API: ${url}`);
    }
    
  } catch (err: any) {
    if (err.name === "TimeoutError") {
      throw new Error(`Request to ${url} timed out after ${timeoutMs}ms`);
    }
    err.failedRequestId = requestId; 
    throw err; 
  }
}
