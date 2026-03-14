import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function resetDb() {
  // Resetting database so drills can be run multiple times without conflict
  await pool.query(`DROP TABLE IF EXISTS tasks, users CASCADE;`);
}

async function drillSet2() {
  // Create a users table: id SERIAL PRIMARY KEY, email TEXT UNIQUE, created_at TIMESTAMPTZ DEFAULT NOW().
  await pool.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Create a tasks table: id SERIAL, title TEXT NOT NULL, completed BOOLEAN DEFAULT FALSE.
  await pool.query(`
    CREATE TABLE tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE
    );
  `);

  // Practice TEXT, INTEGER, BOOLEAN, TIMESTAMPTZ data types.
  // Insert users and tasks using INSERT statements.
  await pool.query(
    `INSERT INTO users (email) VALUES ('nexus@example.com'), ('bean@example.com')`,
  );
  await pool.query(
    `INSERT INTO tasks (title) VALUES ('Learn Node.js'), ('Setup Postgres')`,
  );

  // Use SELECT to fetch all rows from each table.
  const usersRes = await pool.query("SELECT * FROM users");
  console.log("Users:", usersRes.rows);

  const tasksRes = await pool.query("SELECT * FROM tasks");
  console.log("Tasks:", tasksRes.rows);
}

async function drillSet3() {
  // Always use parameterized queries with $1, $2, ... placeholders.

  // Create: Insert a new task with INSERT INTO tasks (title) VALUES ($1).
  const insertRes = await pool.query(
    "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
    ["Practice CRUD operations"],
  );
  const newTaskId = insertRes.rows[0].id;
  console.log("Created task:", insertRes.rows[0]);

  // Read: Select tasks by completion status WHERE completed = $1.
  const pendingTasks = await pool.query(
    "SELECT * FROM tasks WHERE completed = $1",
    [false],
  );
  console.log("Pending tasks count:", pendingTasks.rowCount);

  // Update: Mark a task complete UPDATE tasks SET completed = true WHERE id = $1.
  await pool.query("UPDATE tasks SET completed = true WHERE id = $1", [
    newTaskId,
  ]);
  console.log("Task updated.");

  // Delete: Remove a task DELETE FROM tasks WHERE id = $1.
  await pool.query("DELETE FROM tasks WHERE id = $1", [newTaskId]);
  console.log("Task deleted.");
}

async function drillSet4() {
  // Add user_id INTEGER REFERENCES users(id) to tasks table.
  // Handle NULL foreign keys appropriately.
  await pool.query(`
    ALTER TABLE tasks 
    ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
  `);

  const userRes = await pool.query(
    "INSERT INTO users (email) VALUES ($1) RETURNING id",
    ["chair@example.com"],
  );
  const userId = userRes.rows[0].id;

  // Insert tasks linked to specific users.
  await pool.query("INSERT INTO tasks (title, user_id) VALUES ($1, $2)", [
    "Linked task",
    userId,
  ]);

  // Write a query to get all tasks for one user.
  const userTasks = await pool.query("SELECT * FROM tasks WHERE user_id = $1", [
    userId,
  ]);
  console.log("Tasks for user:", userTasks.rows);

  // Use JOIN to get tasks with user email: SELECT t.title, u.email FROM tasks t JOIN users u ON t.user_id = u.id.
  const joinRes = await pool.query(`
    SELECT t.title, u.email 
    FROM tasks t 
    JOIN users u ON t.user_id = u.id
  `);
  console.log("Joined records:", joinRes.rows);
}

async function drillSet5() {
  // Add CHECK (LENGTH(title) > 0) constraint to tasks.
  await pool.query(`
    ALTER TABLE tasks 
    ADD CONSTRAINT title_not_empty CHECK (LENGTH(TRIM(title)) > 0);
  `);

  try {
    await pool.query("INSERT INTO tasks (title) VALUES ($1)", ["   "]);
  } catch (err: any) {
    console.log("Error Empty title:", err.message);
  }

  // Test duplicate email insertion.
  try {
    await pool.query("INSERT INTO users (email) VALUES ($1)", [
      "nexus@example.com",
    ]);
  } catch (err: any) {
    if (err.code === "23505") {
      console.log("Error email already exists:", err.detail);
    }
  }
}

async function main() {
  await resetDb();

  console.log("\n Running Drill Set 2 ");
  await drillSet2();

  console.log("\n Running Drill Set 3 ");
  await drillSet3();

  console.log("\n Running Drill Set 4 ");
  await drillSet4();

  console.log("\n Running Drill Set 5 ");
  await drillSet5();

  await pool.end();
}

main();
