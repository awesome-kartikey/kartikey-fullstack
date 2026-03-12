// A helper to wait for a given time
const sleep4 = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// A mock operation that might fail
let shouldFail = true;
async function mightFail(): Promise<string> {
  if (shouldFail) {
    shouldFail = false; // It will succeed on the second try
    throw new Error("Operation failed!");
  }
  return "Success!";
}

async function retry1<T>(operation: () => Promise<T>, attempts: number): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await operation(); // Attempt the operation
    } catch (error) {
      if (i < attempts - 1) {
        console.log(`Attempt ${i + 1} failed. Retrying in 100ms...`);
        await sleep4(100); // Wait before the next attempt
      } else {
        throw error; // All attempts failed, rethrow the last error
      }
    }
  }
  throw new Error("Should not be reached"); // Should be unreachable
}

// Test it
retry1(mightFail, 3)
  .then(result => console.log(result)) // Expected: "Success!"
  .catch(error => console.error("All retries failed:", error));