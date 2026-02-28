// Implement sleep(ms: number).
// Implement retry<T>(op: () => Promise<T>, attempts = 2, backoffMs = 250).
// Only retry on transient errors (e.g., err.retryable === true).

const sleep1 = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function retry2<T>(
  op: () => Promise<T>,
  attempts = 2,
  backoffMs = 250
): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await op();
    } catch (error) {
      if (i === attempts - 1) throw error;
      await sleep1(backoffMs);
    }
  }
  throw new Error("Unreachable");
}

let callCount = 0;

async function unreliableOp(): Promise<string> {
  callCount++;
  if (callCount < 3) throw new Error("Not ready yet");
  return "Success!";
}

retry2(unreliableOp, 3, 500)
  .then((res) => console.log(res))
  .catch((err) => console.log(err));