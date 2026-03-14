import "dotenv/config";

export function withAuth(clientFn: any, token: string) {
  return async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${token}`);
    
    return clientFn(url, { ...options, headers });
  };
}

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export async function getOAuthToken(): Promise<string> {
  const now = Date.now();
  const bufferMs = 60 * 1000; 

  if (cachedToken && now < tokenExpiresAt - bufferMs) {
    return cachedToken;
  }

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  const mockResponse = {
    access_token: `token-${Date.now()}`,
    expires_in: 3600
  };

  cachedToken = mockResponse.access_token;
  tokenExpiresAt = now + (mockResponse.expires_in * 1000);

  return cachedToken;
}
