// Create a worker thread that runs a CPU-heavy calculation (e.g., Fibonacci).
import { parentPort, workerData } from "worker_threads";

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

try {
  const result = fibonacci(workerData.n);
  parentPort?.postMessage({ success: true, result });
} catch (error: any) {
  parentPort?.postMessage({ success: false, error: error.message });
}
