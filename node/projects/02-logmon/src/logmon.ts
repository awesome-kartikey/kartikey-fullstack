import fs from "fs";
import path from "path";
import readline from "readline";

const fileArg = process.argv[2];
const filterArg = process.argv.find((a) => a.startsWith("--filter="));
const filter = filterArg ? filterArg.split("=")[1] : null;

const LOG_FILE = path.resolve(fileArg ?? "logs/app.log");

let position = 0;
let watcher: fs.FSWatcher | null = null;

function readNewLines(filePath: string) {
  if (!fs.existsSync(filePath)) return;

  const stat = fs.statSync(filePath);
  if (stat.size <= position) return;

  const stream = fs.createReadStream(filePath, {
    start: position,
    encoding: "utf8",
  });
  const rl = readline.createInterface({ input: stream });

  rl.on("line", (line) => {
    if (!line.trim()) return;
    if (filter && !line.includes(filter)) return;
    console.log(line);
  });

  rl.on("close", () => {
    position = stat.size;
  });
}

function waitForFile(filePath: string) {
  const interval = setInterval(() => {
    if (fs.existsSync(filePath)) {
      clearInterval(interval);
      console.log("[logmon] File found. Resuming watch...");
      startWatching(filePath);
    }
  }, 500);
}

function startWatching(filePath: string) {
  if (watcher) {
    watcher.close();
    watcher = null;
  }

  if (!fs.existsSync(filePath)) {
    console.log(`[logmon] File not found: ${filePath}. Waiting...`);
    return waitForFile(filePath);
  }

  position = fs.statSync(filePath).size;
  console.log(
    `[logmon] Watching: ${filePath}${filter ? ` (filter: "${filter}")` : ""}`,
  );

  watcher = fs.watch(filePath, (eventType) => {
    if (eventType === "change") readNewLines(filePath);
    if (eventType === "rename") {
      console.log("[logmon] Rotation detected. Re-watching...");
      setTimeout(() => {
        fs.existsSync(filePath)
          ? startWatching(filePath)
          : waitForFile(filePath);
      }, 200);
    }
  });

  watcher.on("error", (err) => console.error("[logmon] Error:", err.message));
}

process.on("SIGINT", () => {
  console.log("\n[logmon] Shutting down gracefully...");
  if (watcher) watcher.close();
  process.exit(0);
});

startWatching(LOG_FILE);
