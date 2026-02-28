// Implement a simple Semaphore with acquire() / release().
// Write runWithLimit<T>(limit: number, tasks: (() => Promise<T>)[]): Promise<T[]>.
// Validate that only limit tasks run concurrently.

const sleep5 = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class Semaphore {
  private running = 0;

  constructor(private limit: number) {}

  async acquire(): Promise<void> {
    while (this.running >= this.limit) {
      await sleep5(50);
    }
    this.running++;
  }

  release(): void {
    this.running--;
  }
}

async function runWithLimit<T>(limit: number, tasks: (() => Promise<T>)[]): Promise<T[]> {
  const semaphore = new Semaphore(limit);

  return Promise.all(
    tasks.map(async (task) => {
      await semaphore.acquire();
      try {
        return await task();
      } finally {
        semaphore.release();
      }
    }),
  );
}

async function fetchUser(id: string): Promise<string> {
  console.log(`fetchUser(${id}) started at ${Date.now()}`);
  await sleep5(1000);
  return `User_${id}`;
}

const tasks = [() => fetchUser("1"), () => fetchUser("2"), () => fetchUser("3")];

runWithLimit(2, tasks)
  .then((results) => console.log(results))
  .catch((err) => console.log(err));
