// src/01-postgres-setup/test-database.ts
import { getUser, createTask, getUserTasks, closeDb } from "./6.database";

async function main() {
  const { pool } = await import("./6.database");

  const userRes = await pool.query(
    "INSERT INTO users (email) VALUES ($1) ON CONFLICT (email) DO UPDATE SET email=EXCLUDED.email RETURNING *",
    ["randomemail@test.com"],
  );
  const user = userRes.rows[0];
  console.log("User:", user);

  const fetched = await getUser(user.id);
  console.log("getUser:", fetched);

  const task = await createTask(user.id, "Random Tasks");
  console.log("createTask:", task);

  const tasks = await getUserTasks(user.id);
  console.log("getUserTasks:", tasks);

  await closeDb();
}

main();
