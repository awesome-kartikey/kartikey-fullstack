function formatBytes(bytes: number) {
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
}

console.log("Initial memory usage:");
const initial = process.memoryUsage();
console.log("RSS:", formatBytes(initial.rss));
console.log("Heap Total:", formatBytes(initial.heapTotal));
console.log("Heap Used:", formatBytes(initial.heapUsed));
console.log("External:", formatBytes(initial.external));

const data = [];
for (let i = 0; i < 1000000; i++) {
  data.push({ id: i, value: Math.random() });
}

console.log("\nAfter allocating 1M objects:");
const after = process.memoryUsage();
console.log("RSS:", formatBytes(after.rss));
console.log("Heap Used:", formatBytes(after.heapUsed));
console.log("Increase:", formatBytes(after.heapUsed - initial.heapUsed));
