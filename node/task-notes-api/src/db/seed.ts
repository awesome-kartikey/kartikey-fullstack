import { db, closeDb } from "../database.js";
import { users } from "./schema.js";
import bcrypt from "bcrypt";

async function main() {
  const hash = await bcrypt.hash("password123", 10);
  
  await db.insert(users).values([
    { email: "admin@example.com", password_hash: hash, role: "admin" },
    { email: "user@example.com", password_hash: hash, role: "user" },
  ]).onConflictDoNothing({ target: users.email });

  console.log("Seeded database with default users.");
  await closeDb();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
