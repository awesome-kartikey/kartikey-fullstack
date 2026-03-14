// Drill Set 2: JSON Handling¶
// Write a JSON object to a file.
// Read the JSON file and parse it.
// Handle errors if the JSON is invalid.
// Write a helper to safely load JSON with defaults.
// Pretty-print JSON with indentation.

import fs from "fs/promises";

const fileName = "data.json";

const user = { name: "John Doe", age: 30, role: "admin" };

await fs.writeFile(fileName, JSON.stringify(user, null, 4));
console.log("File Created");

await fs.writeFile(
  fileName,
  "{ name: 'Unknown', role: 'guest', date: new Date() }",
);

async function readJsonFile<T>(fileName: string, defaults: T) {
  try {
    const data = await fs.readFile(fileName, "utf8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      console.error("JSON Parsing Error:", error.message);
      return defaults;
    }

    console.error("Unexpected Error:", error);
    return defaults;
  }
}

const loadedUser = await readJsonFile(fileName, {
  name: "Unknown",
  age: 0,
  role: "ghost",
});

console.log("Loaded User:", loadedUser);

await fs.unlink(fileName);
