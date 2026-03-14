// Drill Set 1: File Basics¶
// Create a file and write “Hello, Node.js” into it.
// Append a line to the same file.
// Read the file contents back and print them.
// Delete the file with fs.unlink.
// Check if a file exists before reading.

import * as fs from "node:fs/promises";

async function main() {
  const fileName = "test.txt";

  await fs.writeFile(fileName, "Hello, Node.js\n", "utf8");
  console.log("file created");

  await fs.appendFile(fileName, "Second line appended\n", "utf8");
  console.log("line appended");

  const content = await fs.readFile(fileName, "utf8");
  console.log("contents:");
  console.log(content);

  await fs.unlink(fileName);
  console.log("file deleted");

  try {
    await fs.access(fileName);
    const data = await fs.readFile(fileName, "utf8");
    console.log(data);
  } catch (err) {
    console.log("file does not exist");
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
