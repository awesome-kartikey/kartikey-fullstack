// Drill Set 5: Writable Streams¶
// Create a write stream for a log file.
// Write multiple lines in a loop.
// Ensure the stream is closed with finish event.
// Handle backpressure with stream.write() return value.
// Write binary data to a file with a Buffer.

import * as fs from "fs";

const logStream = fs.createWriteStream("./application.log", { flags: "a" });

for (let i = 0; i < 100; i++) {
  logStream.write(`Line ${i + 1}\n`);
}
// logStream.end();

// logStream.on("finish", () => console.log("Log file written."));

function writeMore() {
  for (let i = 0; i < 100; i++) {
    const canContinue = logStream.write(`Line ${i + 1}\n`);
    if (!canContinue) {
      console.log("Waiting for draininig");
      logStream.once("drain", writeMore);
    }
  }
  logStream.end(() => console.log("Log file written."));
}
writeMore();

const bufferFile = fs.createWriteStream("./buffer.txt");
const buf = Buffer.alloc(10, 0xff);
bufferFile.write(buf);
bufferFile.end(() => console.log("Buffer file written."));
