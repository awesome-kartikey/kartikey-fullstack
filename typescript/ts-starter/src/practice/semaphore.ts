class Semaphore10 {
  private count: number;
  private queue: Array<() => void>;
  private max: number;

  constructor(max: number) {
    this.count = max;
    this.max = max;
    this.queue = [];
    console.log(`🟢 Semaphore created with max concurrency = ${max}\n`);
  }

  async acquire(taskId: number): Promise<void> {
    console.log(
      `➡️ Task ${taskId} requesting permit | Available: ${this.count} | Queue: ${this.queue.length}`
    );

    if (this.count > 0) {
      this.count--;
      console.log(
        `✅ Task ${taskId} acquired permit immediately | Remaining: ${this.count}\n`
      );
      return;
    }

    console.log(`⏳ Task ${taskId} waiting in queue...\n`);

    await new Promise<void>((resolve) => {
      this.queue.push(() => {
        console.log(
          `🔓 Task ${taskId} resumed from queue | Available before decrement: ${this.count}`
        );
        this.count--;
        resolve();
      });
    });
  }

  release(taskId: number): void {
    console.log(
      `⬅️ Task ${taskId} releasing permit | Queue: ${this.queue.length}`
    );

    if (this.queue.length > 0) {
      const next = this.queue.shift();
      console.log(`🚀 Passing permit to next queued task\n`);
      next && next();
    } else {
      this.count++;
      console.log(
        `➕ No waiting tasks23 | Available permits: ${this.count}\n`
      );
    }
  }
}

async function runWithLimit<T>(
  limit: number,
  tasks23: Array<() => Promise<T>>
): Promise<T[]> {
  console.log(`\n========== RUN WITH LIMIT ${limit} ==========\n`);

  const semaphore = new Semaphore10(limit);
  const results: T[] = new Array(tasks23.length);

  const wrappedTasks = tasks23.map((task, index) => {
    return (async () => {
      const taskId = index + 1;

      await semaphore.acquire(taskId);

      try {
        console.log(`🟡 Task ${taskId} STARTED\n`);
        const result = await task();
        results[index] = result;
        console.log(`🟢 Task ${taskId} COMPLETED\n`);
      } catch (error) {
        console.log(`🔴 Task ${taskId} FAILED\n`);
      } finally {
        semaphore.release(taskId);
      }
    })();
  });

  await Promise.all(wrappedTasks);

  console.log(`\n========== ALL TASKS FINISHED ==========\n`);
  return results;
}

function createTask(id: number, delay: number) {
  return async () => {
    console.log(`   🔧 Executing Task ${id} (delay: ${delay}ms)`);
    await new Promise((res) => setTimeout(res, delay));
    return id;
  };
}

const tasks23 = [
  createTask(1, 1000),
  createTask(2, 1000),
  createTask(3, 1000),
  createTask(4, 1000),
  createTask(5, 1000),
];

runWithLimit(2, tasks23);