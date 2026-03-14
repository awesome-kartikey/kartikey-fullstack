// Drill Set 8: Watchers¶
// Use fs.watch to monitor a file for changes.
// Log whenever the file is modified.
// Handle rename events separately.
// Debounce frequent events into one log.
// Stop watching after 30 seconds.

import * as fs from "fs";

console.log("Watching file for changes...");

let timer: NodeJS.Timeout;

const watcher = fs.watch("watch.ts", (eventType, filename) => {
  if (!filename) return;
  if (eventType === "rename") {
    console.log("Renamed to:", filename);
  }

  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    console.log(`File changed: ${eventType} - ${filename}`);
  }, 300);
});

setTimeout(() => {
  console.log("Stopping watcher");
  watcher.close();
}, 30000);
