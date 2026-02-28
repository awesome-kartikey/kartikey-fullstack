// Demonstrate a "background" task: start a promise without awaiting.
// Add a linter-like rule to always attach .catch() for logging.
// Prefer explicit task managers for long-running jobs.

async function sendAnalytics(event: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("Analytics sent:", event);
}

sendAnalytics("page_view").catch((err) => console.log("Analytics failed:", err));

console.log("Continues immediately");


//advantages of yaml
// Things to watch out when running background tasks:
// 1. Ensure unhandled rejections are avoided (always await or return the promise).
// 2. Ensure all tasks are cancelled when the process exits.
// 3. Ensure all tasks are cancelled when the process receives a SIGINT.
// 4. Ensure all tasks are cancelled when the process receives a SIGTERM.