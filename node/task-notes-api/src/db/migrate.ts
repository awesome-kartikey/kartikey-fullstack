import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, closeDb } from "../database.js";

async function main() {
  console.log("Running Drizzle Migrations...");
  await migrate(db, { migrationsFolder: "./migrations" });
  console.log("Migrations applied successfully.");
  await closeDb();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
