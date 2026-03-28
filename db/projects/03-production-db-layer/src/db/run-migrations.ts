import fs from "fs/promises";
import path from "path";
import { pool } from "./pool.js";

async function run() {
  const args = process.argv.slice(2);
  const command = args[0] || "up";

  const client = await pool.connect();
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS _migrations (id SERIAL PRIMARY KEY, name TEXT UNIQUE)`,
    );

    const migrationsDir = path.join(process.cwd(), "migrations");
    const files = await fs.readdir(migrationsDir);

    if (command === "up") {
      const upFiles = files.filter((f) => f.endsWith(".up.sql")).sort();
      for (const file of upFiles) {
        const check = await client.query(
          "SELECT 1 FROM _migrations WHERE name = $1",
          [file],
        );
        if (check.rowCount === 0) {
          const sql = await fs.readFile(
            path.join(migrationsDir, file),
            "utf-8",
          );
          await client.query("BEGIN");
          await client.query(sql);
          await client.query("INSERT INTO _migrations (name) VALUES ($1)", [
            file,
          ]);
          await client.query("COMMIT");
          console.log(`Applied ${file}`);
        }
      }
    } else if (command === "down") {
      const downFiles = files
        .filter((f) => f.endsWith(".down.sql"))
        .sort()
        .reverse();
      for (const file of downFiles) {
        const sql = await fs.readFile(path.join(migrationsDir, file), "utf-8");
        await client.query(sql);
        console.log(`Rolled back ${file}`);
      }
      await client.query("DELETE FROM _migrations");
    } else if (command === "reset") {
      console.log("Resetting database...");
      await client.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
    }
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(console.error);
