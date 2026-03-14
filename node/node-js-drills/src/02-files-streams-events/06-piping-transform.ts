// Drill Set 6: Piping & Transform¶
// Pipe a read stream to a write stream.
// Create a transform stream that uppercases text.
// Pipe a file through the transform to another file.
// Measure time taken to copy a large file with streams.
// Compare memory usage with readFile vs streaming.

import * as fs from "fs";
import { Transform } from "stream";
import { pipeline } from "stream/promises";

const upper = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString("utf8").toUpperCase());
    callback();
  },
});

function logMemory(label: string) {
  const { heapUsed, rss } = process.memoryUsage();
  console.log(
    `${label} -> Heap: ${(heapUsed / 1024 / 1024).toFixed(2)} MB | RSS: ${(rss / 1024 / 1024).toFixed(2)} MB`,
  );
}

try {
  console.time("Streaming Time");
  await pipeline(
    fs.createReadStream("oneMB.txt"),
    // fs.createWriteStream("oneMB-copied.txt"),
    upper,
    fs.createWriteStream("upper.txt"),
  );
  console.timeEnd();
} catch (error) {
  console.error("Error copying file through streams:", error);
}
// console.log("Finished copying file through streams using Pipeline");
console.log("Uppercase file created");

logMemory("Before readFile");
console.time("readFile Time");

const fileData = await fs.promises.readFile("oneMB.txt", "utf8");
await fs.promises.writeFile("upper-readfile.txt", fileData.toUpperCase());

console.timeEnd("readFile Time");
logMemory("After readFile");

logMemory("Before Streaming");
console.time("Streaming Time");

await pipeline(
  fs.createReadStream("oneMB.txt"),
  upper,
  fs.createWriteStream("upper-stream.txt"),
);

console.timeEnd("Streaming Time");
logMemory("After Streaming");
