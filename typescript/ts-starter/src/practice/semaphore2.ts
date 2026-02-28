/**
 * ============================================================
 *  CONCURRENCY LIMITER — Semaphore11 Pattern
 * ============================================================
 *
 *  WHAT THIS FILE DEMONSTRATES:
 *  ┌─────────────────────────────────────────────────────────┐
 *  │  JavaScript Runtime Model                               │
 *  │                                                         │
 *  │  Call Stack        Microtask Queue   Macrotask Queue    │
 *  │  ┌──────────┐      ┌─────────────┐  ┌──────────────┐   │
 *  │  │ fn()     │  →   │ .then() /   │  │ setTimeout() │   │
 *  │  │ fn()     │      │ async/await │  │ setInterval()│   │
 *  │  │ fn()     │      └─────────────┘  └──────────────┘   │
 *  │  └──────────┘              ↑                ↑           │
 *  │        ↑           Runs BEFORE         Runs AFTER       │
 *  │        │           next macro           all micro       │
 *  │   Event Loop ──────────────────────────────────────→    │
 *  └─────────────────────────────────────────────────────────┘
 *
 *  EXECUTION ORDER RULES:
 *  1. Synchronous code runs first (fills the Call Stack)
 *  2. Microtasks run next (Promise.then, async/await continuations)
 *  3. Macrotasks run last (setTimeout, setInterval, I/O callbacks)
 *  4. After EACH macrotask, the engine drains ALL microtasks
 *
 *  SEMAPHORE CONCEPT:
 *  A semaphore is a concurrency primitive that limits how many
 *  async tasks can run at the same time. Think of it as a
 *  bouncer at a club — only N people allowed inside at once.
 *  Others wait in a queue until someone leaves.
 */

// ─────────────────────────────────────────────────────────────
//  SECTION 1: LOGGER UTILITY
//  A lightweight logger that timestamps every log line and
//  numbers each entry so you can trace execution order exactly.
// ─────────────────────────────────────────────────────────────

let globalLogEntryCount = 0;

function log(message: string): void {
  globalLogEntryCount++;
  const timeOfLog = new Date().toISOString().split("T")[1]?.replace("Z", "") || "";
  console.log(`[${String(globalLogEntryCount).padStart(3, "0")}] ${timeOfLog}  ${message}`);
}

function logSection(title: string): void {
  console.log("\n" + "═".repeat(60));
  console.log(`  ${title}`);
  console.log("═".repeat(60) + "\n");
}

function logDivider(): void {
  console.log("  " + "─".repeat(56));
}

// ─────────────────────────────────────────────────────────────
//  SECTION 2: SEMAPHORE CLASS
//
//  A Semaphore11 controls access to a shared resource by
//  maintaining a counter of available "permits".
//
//  How it works internally:
//  ┌──────────────────────────────────────────────────────┐
//  │  acquire() called                                    │
//  │      │                                               │
//  │      ▼                                               │
//  │  count > 0?  ──YES──→  count--  →  run task          │
//  │      │                                               │
//  │      NO                                              │
//  │      │                                               │
//  │      ▼                                               │
//  │  Push resolver into queue[]                          │
//  │  Task suspends (await new Promise)                   │
//  │  Event loop moves on to next task                    │
//  │                                                      │
//  │  release() called by finishing task                  │
//  │      │                                               │
//  │      ▼                                               │
//  │  queue empty? ──NO──→  shift() resolver → call it   │
//  │      │                  (microtask: resumes waiting  │
//  │      │                   task via Promise.resolve)   │
//  │      YES                                             │
//  │      │                                               │
//  │      ▼                                               │
//  │  count++  (permit returned to pool)                  │
//  └──────────────────────────────────────────────────────┘
// ─────────────────────────────────────────────────────────────

class Semaphore11 {
  private availablePermits: number;
  private readonly maxPermits: number;
  private readonly suspendedTaskResolverQueue: Array<() => void>;

  constructor(maxConcurrency: number) {
    this.maxPermits = maxConcurrency;
    this.availablePermits = maxConcurrency;
    this.suspendedTaskResolverQueue = [];

    log(`🏗️  [SYNC]  Semaphore11 constructed`);
    log(`           max concurrency  = ${maxConcurrency}`);
    log(`           available permits = ${this.availablePermits}`);
    log(`           wait queue        = [] (empty)`);
  }

  /**
   * acquire()
   * ---------
   * Requests a permit to run. If one is free, returns immediately.
   * If not, suspends the caller and adds it to the wait queue.
   *
   * EVENT LOOP NOTE:
   *   "await semaphore.acquire()" suspends the current async
   *   function. The Event Loop is now FREE to pick up other
   *   tasks from the queue while this task waits.
   */
  async acquire(taskId: number): Promise<void> {
    log(`➡️  [STACK] Task-${taskId} → acquire() entered`);
    log(`           permits available = ${this.availablePermits}`);
    log(`           tasks in queue    = ${this.suspendedTaskResolverQueue.length}`);

    if (this.availablePermits > 0) {
      // ── FAST PATH ──────────────────────────────────────────
      // A permit is free. Claim it synchronously and return.
      // No Promise suspension happens here — stays on Call Stack.
      this.availablePermits--;

      log(`✅  [STACK] Task-${taskId} → permit GRANTED immediately`);
      log(`           permits remaining = ${this.availablePermits}`);
      logDivider();
      return; // synchronous return, no await needed
    }

    // ── SLOW PATH ──────────────────────────────────────────────
    // No permits free. We must suspend this task.
    // "new Promise(resolve => queue.push(resolve))" does two things:
    //   1. Stores the resolve function in our queue
    //   2. Suspends THIS function at the "await" keyword
    //
    // The Call Stack unwinds back to the event loop.
    // Other tasks can now run.
    log(`⏳  [STACK] Task-${taskId} → NO permits free`);
    log(`           suspending Task-${taskId} and pushing to queue`);
    log(`           ↳ Event Loop is now FREE to run other tasks`);
    logDivider();

    await new Promise<void>((resumeSuspendedTask) => {
      // This callback runs SYNCHRONOUSLY inside the Promise constructor
      // (before the await suspends the outer function)
      this.suspendedTaskResolverQueue.push(() => {
        // This inner function will be called by release() later.
        // At that point we are BACK in the Event Loop (microtask queue).
        //
        // PERMIT ACCOUNTING NOTE:
        //   In the direct-handoff path, release() does NOT increment
        //   availablePermits — the permit is transferred directly.
        //   So we should NOT decrement here either.
        //   The net effect: count stays at 0, correctly reflecting
        //   that the permit is now held by THIS resumed task.
        log(`🔓  [MICRO] Task-${taskId} → resumed from wait queue`);
        log(`           ↳ This runs as a MICROTASK after release() is called`);
        log(`           permit handed directly (count stays = ${this.availablePermits})`);
        resumeSuspendedTask(); // unblock the suspended "await" above
      });
    });

    log(`▶️  [MICRO] Task-${taskId} → acquire() complete (resumed)`);
    logDivider();
  }

  /**
   * release()
   * ---------
   * Returns a permit to the pool after a task finishes.
   * If tasks are waiting, hands the permit directly to the next one.
   *
   * EVENT LOOP NOTE:
   *   Calling queue.shift()() is a synchronous call, but the
   *   function it calls internally does `resolve()` which schedules
   *   a microtask — the suspended task resumes on the NEXT
   *   microtask checkpoint (before any macrotask like setTimeout).
   */
  release(taskId: number): void {
    log(`⬅️  [STACK] Task-${taskId} → release() called`);
    log(`           tasks waiting in queue = ${this.suspendedTaskResolverQueue.length}`);

    if (this.suspendedTaskResolverQueue.length > 0) {
      // Hand the permit directly to the next waiting task.
      // We do NOT increment availablePermits — the permit is
      // being transferred, not returned to the pool.
      const nextSuspendedTaskResolver = this.suspendedTaskResolverQueue.shift()!;

      log(`🚀  [STACK] Task-${taskId} → handing permit to next queued task`);
      log(`           ↳ calling resolver() → schedules MICROTASK to resume waiter`);

      nextSuspendedTaskResolver(); // synchronously calls the function stored in the queue
                                   // which calls resolve() → adds microtask to engine queue
    } else {
      // Nobody is waiting. Return the permit to the pool.
      this.availablePermits++;
      log(`➕  [STACK] Task-${taskId} → no tasks waiting`);
      log(`           permit returned to pool`);
      log(`           permits now available = ${this.availablePermits}`);
    }

    logDivider();
  }
}

// ─────────────────────────────────────────────────────────────
//  SECTION 3: TASK RUNNER
//
//  runWithConcurrencyLimit() wraps each task with:
//    acquire → [run task] → release
//
//  All wrapped tasks are kicked off at once with Promise.all().
//  The Semaphore11 controls which ones ACTUALLY run vs. which
//  ones are suspended waiting for a permit.
//
//  MEMORY / HEAP NOTE:
//   - Each task creates a closure (function + captured variables)
//   - Suspended tasks stay in the heap as pending Promises
//   - They are NOT garbage collected because the queue holds a
//     reference to their resolver function
//   - Once resolved and the promise chain completes, the closures
//     become eligible for GC
// ─────────────────────────────────────────────────────────────

async function runWithConcurrencyLimit<T>(
  maxConcurrency: number,
  taskFunctions: Array<() => Promise<T>>
): Promise<T[]> {
  logSection(`STARTING RUN  |  tasks: ${taskFunctions.length}  |  concurrency limit: ${maxConcurrency}`);

  log(`📋  [SYNC]  Creating Semaphore11 with limit = ${maxConcurrency}`);
  const semaphore = new Semaphore11(maxConcurrency);

  const orderedResults: T[] = new Array(taskFunctions.length);

  log(`\n📋  [SYNC]  Wrapping ${taskFunctions.length} tasks with acquire/release guards`);
  log(`           ↳ No tasks have STARTED yet — this is still synchronous setup`);
  logDivider();

  // map() runs synchronously right now.
  // Each call to the async IIFE inside kicks off and runs until
  // the first `await` (which is semaphore.acquire).
  // After that first await the function suspends and map() continues
  // to the NEXT iteration — this is why all tasks "start" before any finish.
  const semaphoreGuardedPromises = taskFunctions.map((taskFn, taskIndex) => {
    const taskId = taskIndex + 1;

    log(`📌  [SYNC]  Scheduling Task-${taskId} (async IIFE created)`);

    // This async IIFE is called immediately (the trailing `()`)
    // but it runs asynchronously.
    return (async () => {
      log(`\n🔷  [STACK] Task-${taskId} IIFE → starting, calling acquire()`);

      // ── ACQUIRE ─────────────────────────────────────────────
      // If a permit is free  → runs synchronously, no suspension
      // If no permits free   → suspends here, Event Loop picks next task
      await semaphore.acquire(taskId);

      // ── EXECUTE ─────────────────────────────────────────────
      try {
        log(`🟡  [STACK] Task-${taskId} → RUNNING (permit held)`);
        log(`           ↳ task() will call setTimeout internally → MACROTASK`);

        const taskResult = await taskFn();       // <── task suspends here for setTimeout
        orderedResults[taskIndex] = taskResult;

        log(`🟢  [STACK] Task-${taskId} → COMPLETED successfully`);
        log(`           result stored at index [${taskIndex}]`);
      } catch (taskError) {
        log(`🔴  [STACK] Task-${taskId} → FAILED with error: ${taskError}`);
      } finally {
        // ── RELEASE ───────────────────────────────────────────
        // always runs, even on error — prevents deadlocks
        log(`🏁  [STACK] Task-${taskId} → DONE, entering finally → release()`);
        semaphore.release(taskId);
      }
    })();
  });

  logSection("ALL TASKS DISPATCHED — Event Loop now drives execution");
  log(`⏳  [SYNC]  Awaiting Promise.all() — main function suspends`);
  log(`           ↳ Event Loop will process tasks and microtasks until all resolve`);
  logDivider();

  await Promise.all(semaphoreGuardedPromises);

  logSection("ALL TASKS FINISHED");
  log(`📦  Results: [${orderedResults.join(", ")}]`);
  logDivider();

  return orderedResults;
}

// ─────────────────────────────────────────────────────────────
//  SECTION 4: REAL-WORLD TASK FACTORY
//
//  In a real application these tasks would be:
//    - HTTP API calls (fetch/axios)
//    - Database queries
//    - File system reads/writes
//    - Image / video processing jobs
//
//  Here we simulate latency with setTimeout().
//
//  MACROTASK NOTE:
//    setTimeout(fn, delay) schedules `fn` in the MACROTASK queue.
//    After `delay` ms, the engine puts `fn` into the macrotask queue.
//    It will run AFTER all pending microtasks are drained.
// ─────────────────────────────────────────────────────────────

interface TaskConfig {
  id: number;
  label: string;
  simulatedDurationMs: number;
}

function createSimulatedApiTask(config: TaskConfig): () => Promise<string> {
  return async (): Promise<string> => {
    const { id, label, simulatedDurationMs } = config;

    log(`   🌐 [MACRO] Task-${id} "${label}" → API call started`);
    log(`              ↳ setTimeout(${simulatedDurationMs}ms) registered → MACROTASK QUEUE`);

    // setTimeout hands off to the Web API / Node timer.
    // Our function suspends here. The event loop is FREE.
    await new Promise<void>((resolve) => setTimeout(resolve, simulatedDurationMs));

    log(`   ✔️  [MACRO] Task-${id} "${label}" → API call finished (${simulatedDurationMs}ms elapsed)`);

    return `response-from-task-${id}`;
  };
}

// ─────────────────────────────────────────────────────────────
//  SECTION 5: ENTRY POINT
//
//  We define 5 simulated API tasks with various response times.
//  Concurrency limit = 2 means:
//    - Tasks 1 & 2 start immediately
//    - Tasks 3, 4, 5 WAIT in the Semaphore11 queue
//    - As each task finishes, the next waiting task gets a permit
// ─────────────────────────────────────────────────────────────

const simulatedApiTaskConfigs: TaskConfig[] = [
  { id: 1, label: "Fetch user profile",      simulatedDurationMs: 1200 },
  { id: 2, label: "Fetch account balance",   simulatedDurationMs: 800  },
  { id: 3, label: "Fetch transaction list",  simulatedDurationMs: 1000 },
  { id: 4, label: "Fetch notifications",     simulatedDurationMs: 600  },
  { id: 5, label: "Fetch recent activity",   simulatedDurationMs: 900  },
];

const MAX_CONCURRENT_TASKS = 2;

logSection("PROGRAM START — Synchronous setup phase");
log(`📋  [SYNC]  Building task list from ${simulatedApiTaskConfigs.length} task configs`);
log(`           Concurrency limit set to: ${MAX_CONCURRENT_TASKS}`);
log(`           (Tasks 1-${MAX_CONCURRENT_TASKS} will run immediately)`);
log(`           (Tasks ${MAX_CONCURRENT_TASKS + 1}-${simulatedApiTaskConfigs.length} will WAIT for a permit)\n`);

const simulatedApiTasks = simulatedApiTaskConfigs.map((config) => createSimulatedApiTask(config));

log(`📋  [SYNC]  Task list ready — ${simulatedApiTasks.length} tasks created (not yet started)`);
log(`           Calling runWithConcurrencyLimit() ...\n`);

// The top-level await (or .then) here is the LAST synchronous statement.
// After this line, the Call Stack empties and the Event Loop takes over.
runWithConcurrencyLimit(MAX_CONCURRENT_TASKS, simulatedApiTasks).then((allTaskResults) => {
  logSection("FINAL RESULTS SUMMARY");
  allTaskResults.forEach((taskResponse, taskIndex) => {
    log(`   Task-${taskIndex + 1}: ${taskResponse}`);
  });
  log(`\n🏆  [DONE]  All ${allTaskResults.length} tasks completed successfully`);
  log(`           Total log entries: ${globalLogEntryCount}`);
});

log(`\n💡  [SYNC]  runWithConcurrencyLimit() returned a Promise (not yet resolved)`);
log(`           Call Stack is now EMPTY — Event Loop takes over\n`);