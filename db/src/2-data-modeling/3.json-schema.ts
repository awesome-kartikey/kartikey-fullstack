import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function resetDb() {
  await pool.query(
    `DROP TABLE IF EXISTS comments, tasks, projects, user_preferences, users CASCADE;`,
  );

  await pool.query(`
    CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT);
    CREATE TABLE tasks (id SERIAL PRIMARY KEY, title TEXT);
  `);
}

async function drillSet5() {
  // Add metadata JSONB column to tasks table.
  await pool.query(
    `ALTER TABLE tasks ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;`,
  );

  // Store flexible data: {"priority": "high", "tags": ["important"], "due_date": "2024-01-15"}.
  const taskRes = await pool.query(
    `
    INSERT INTO tasks (title, metadata) 
    VALUES ($1, $2) RETURNING id
  `,
    [
      "Complete audit",
      { priority: "high", tags: ["important"], due_date: "2024-01-15" },
    ],
  );
  const taskId = taskRes.rows[0].id;

  // Query tasks by JSON field: WHERE metadata->>'priority' = 'high'.
  const queryRes = await pool.query(`
    SELECT title, metadata 
    FROM tasks 
    WHERE metadata->>'priority' = 'high';
  `);
  console.log("High priority tasks:", queryRes.rows);

  // Update JSON data: UPDATE tasks SET metadata = metadata || '{"completed_at": "..."}'.
  await pool.query(
    `
    UPDATE tasks 
    SET metadata = metadata || '{"completed_at": "2024-01-10"}'::jsonb 
    WHERE id = $1;
  `,
    [taskId],
  );

  // Index on JSON field for performance: CREATE INDEX ON tasks USING gin(metadata).
  await pool.query(
    `CREATE INDEX tasks_metadata_gin_idx ON tasks USING gin(metadata);`,
  );
  console.log("Added GIN index to metadata column.");
}

async function drillSet6() {
  // Design a projects table that contains multiple tasks.
  await pool.query(`
    CREATE TABLE projects (
      id SERIAL PRIMARY KEY, 
      name TEXT
    );
  `);

  // Add project_id foreign key to tasks (tasks can belong to projects or be standalone).
  await pool.query(`
    ALTER TABLE tasks 
    ADD COLUMN project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE;
  `);

  // Create a user_preferences table with JSONB for flexible user settings.
  await pool.query(`
    CREATE TABLE user_preferences (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      settings JSONB DEFAULT '{}'::jsonb
    );
  `);

  // Design comments table: comments on tasks with author and timestamp.
  await pool.query(`
    CREATE TABLE comments (
      id SERIAL PRIMARY KEY,
      task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
      author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Populate data to write relationship queries
  const user = await pool.query(
    `INSERT INTO users (name) VALUES ('Jane') RETURNING id`,
  );
  const project = await pool.query(
    `INSERT INTO projects (name) VALUES ('Migration') RETURNING id`,
  );
  const task = await pool.query(
    `INSERT INTO tasks (title, project_id) VALUES ('Plan schema', $1) RETURNING id`,
    [project.rows[0].id],
  );

  await pool.query(
    `INSERT INTO comments (task_id, author_id, content) VALUES ($1, $2, 'Looks good')`,
    [task.rows[0].id, user.rows[0].id],
  );

  // Write queries that span multiple relationships.
  const complexQuery = await pool.query(`
    SELECT p.name as project, t.title as task, c.content as comment, u.name as commenter
    FROM projects p
    JOIN tasks t ON t.project_id = p.id
    JOIN comments c ON c.task_id = t.id
    JOIN users u ON c.author_id = u.id;
  `);
  console.log("Data across multiple relationships:", complexQuery.rows);
}

async function main() {
  await resetDb();

  console.log("\n--- Running Drill Set 5 ---");
  await drillSet5();

  console.log("\n--- Running Drill Set 6 ---");
  await drillSet6();

  await pool.end();
}

main();
