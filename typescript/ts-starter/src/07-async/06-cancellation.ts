// Create a helper withTimeoutSignal(ms) that returns { controller, signal } and a timer; abort on timeout.
// Pass signal into a mock fetch and verify it aborts.
// Combine with retry so aborted operations do not retry.

const sleep3 = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function withTimeoutSignal(ms: number): { controller: AbortController; signal: AbortSignal } {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return { controller, signal: controller.signal };
}

async function mockFetch(signal: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    signal.addEventListener("abort", () => reject("Request was aborted"));
    setTimeout(() => resolve("Fetched data"), 2000);
  });
}

async function retry3<T>(op: () => Promise<T>, attempts = 2, backoffMs = 250): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await op();
    } catch (error) {
      if (error === "Request was aborted") throw error;
      if (i === attempts - 1) throw error;
      await sleep3(backoffMs);
    }
  }
  throw new Error("Unreachable");
}

const { signal: signal1 } = withTimeoutSignal(1000);
mockFetch(signal1)
  .then((data) => console.log("Test 1:", data))
  .catch((err) => console.log("Test 1:", err));

const { signal: signal2 } = withTimeoutSignal(3000);
mockFetch(signal2)
  .then((data) => console.log("Test 2:", data))
  .catch((err) => console.log("Test 2:", err));
