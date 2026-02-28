import fs from "fs-extra";
await fs.ensureDir(".data");
await fs.writeJSON(
  ".data/state.json",
  { ok: true, updatedAt: new Date().toISOString() },
  { spaces: 2 },
);
const state = await fs.readJSON(".data/state.json");

// Files: Write/read a JSON file under .data/ using fs-extra.

console.log("Read:", state);
