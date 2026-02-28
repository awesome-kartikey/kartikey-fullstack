// Implement timeout<T>(p: Promise<T>, ms: number): Promise<T> that rejects after ms.
// Wrap a slow promise with timeout and verify it rejects.
// Discuss why timeouts should usually be per operation (not global).

function timeout<T>(p: Promise<T>, ms: number): Promise<T> {
  const car1 = new Promise<T>((_, reject) => {
    const timer = setTimeout(() => {
      reject("Timed out");
    }, ms);
  });
  return Promise.race([p, car1]);
}
const slowpromise = new Promise((resolve) => setTimeout(() => resolve("Done!"), 1500));

// timeout(new Promise((resolve) => setTimeout(() => resolve("Done!"), 1500)), 1000)
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err));

timeout(slowpromise, 1000)
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

// A global timeout would cancel ALL requests if any one is slow.
// Per-operation timeouts are fair — each request gets its own limit.
