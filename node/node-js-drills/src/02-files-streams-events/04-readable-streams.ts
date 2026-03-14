// Drill Set 4: Readable Streams¶
// Create a read stream for a text file.
// Read data in chunks and log chunk sizes.
// Count how many chunks are emitted for a 1 MB file.
// Handle the end event to print “done.”
// Add error handling for missing file.

import * as fs from "fs";

const rs = fs.createReadStream("oneMB.txt", {
  highWaterMark: 64 * 1024,
});

let count = 0;
rs.on("data", (chunk) => {
  count++;
  console.log("Chunk size: ", chunk.length);
});
rs.on("end", () => {
  console.log("Total chunks: ", count);
  console.log("Done reading file.");
});

rs.on("error", (error) => {
  console.error("Error reading file: ", error);
});
