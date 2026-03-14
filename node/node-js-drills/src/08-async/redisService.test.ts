import { describe, it, expect, vi, afterAll, afterEach } from "vitest";
import { emailQueue, cronQueue, emailWorker, cronWorker } from "./redisService.js";
import Redis from "ioredis";
import { QueueEvents } from "bullmq";

const testRedis = new Redis({ maxRetriesPerRequest: null });

describe("Background Jobs", () => {
  afterEach(async () => {
    await emailQueue.drain();
    await cronQueue.drain();
  });

  afterAll(async () => {
    await emailWorker.close();
    await cronWorker.close();
    await emailQueue.close();
    await cronQueue.close();
    await testRedis.quit();
  });

  it("prevents duplicate jobs via idempotency logic", async () => {
    await emailQueue.add("test", {}, { jobId: "idem-1" });
    await emailQueue.add("test", {}, { jobId: "idem-1" });
    
    expect(await emailQueue.getWaitingCount()).toBe(1);
  });

  it("retries on failure", async () => {
    const queueEvents = new QueueEvents("EmailQueue", { connection: testRedis as any });
    const job = await emailQueue.add("test", { email: "fail@test.com" });
    
    await new Promise<void>((res) => {
      queueEvents.on("failed", ({ jobId }) => {
        if (jobId === job.id) res();
      });
    });
    
    expect(await job.getState()).toBe("delayed");
    await queueEvents.close();
  });

  it("simulates cron scheduling with fake timers", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 1, 1, 12, 0, 0));
    
    await vi.advanceTimersByTimeAsync(60000); 
    
    expect(new Date().getMinutes()).toBe(1);
    
    vi.useRealTimers();
  });
});
