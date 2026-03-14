import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function resetDb() {
  await pool.query(
    `DROP TABLE IF EXISTS task_tags, tags, tasks, categories, users CASCADE;`,
  );

  await pool.query(`
    CREATE TABLE users (id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL);
    CREATE TABLE tasks (id SERIAL PRIMARY KEY, title TEXT NOT NULL, user_id INTEGER REFERENCES users(id));
  `);

  const userRes = await pool.query(
    `INSERT INTO users (email) VALUES ('user@example.com') RETURNING id`,
  );
  const userId = userRes.rows[0].id;
  await pool.query(
    `INSERT INTO tasks (title, user_id) VALUES ('Initial Task', $1)`,
    [userId],
  );
}

async function drillSet1() {
  // Create a categories table: id SERIAL PRIMARY KEY, name TEXT UNIQUE, color TEXT.
  await pool.query(`
    CREATE TABLE categories (
      id SERIAL PRIMARY KEY, 
      name TEXT UNIQUE NOT NULL, 
      color TEXT
    );
  `);

  // Extend your tasks table with category_id foreign key.
  await pool.query(`
    ALTER TABLE tasks 
    ADD COLUMN category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;
  `);

  // Insert categories: "Work", "Personal", "Shopping".
  await pool.query(`
    INSERT INTO categories (name, color) VALUES 
    ('Work', 'Blue'), ('Personal', 'Green'), ('Shopping', 'Yellow');
  `);

  // Update existing tasks to belong to categories.
  await pool.query(`
    UPDATE tasks 
    SET category_id = (SELECT id FROM categories WHERE name = 'Work');
  `);

  // Query tasks grouped by category name.
  // Using a standard JOIN instead of complex aggregations
  const categoryQuery = await pool.query(`
    SELECT c.name as category_name, t.title as task_title
    FROM categories c
    LEFT JOIN tasks t ON c.id = t.category_id
    ORDER BY c.name;
  `);
  console.log("Tasks by category:", categoryQuery.rows);
}

async function drillSet2() {
  // Create a tags table: id SERIAL PRIMARY KEY, name TEXT UNIQUE.
  await pool.query(`
    CREATE TABLE tags (
      id SERIAL PRIMARY KEY, 
      name TEXT UNIQUE NOT NULL
    );
  `);

  // Create a junction table task_tags: task_id INTEGER REFERENCES tasks(id), tag_id INTEGER REFERENCES tags(id).
  await pool.query(`
    CREATE TABLE task_tags (
      task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
      tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (task_id, tag_id)
    );
  `);

  // Insert tags: "urgent", "home", "office".
  await pool.query(`
    INSERT INTO tags (name) VALUES ('urgent'), ('home'), ('office');
  `);

  // Assign multiple tags to tasks through the junction table.
  const taskRes = await pool.query("SELECT id FROM tasks LIMIT 1");
  const taskId = taskRes.rows[0].id;

  await pool.query(
    `
    INSERT INTO task_tags (task_id, tag_id) VALUES 
    ($1, (SELECT id FROM tags WHERE name = 'urgent')),
    ($1, (SELECT id FROM tags WHERE name = 'office'));
  `,
    [taskId],
  );

  // Query all tasks with their associated tag names.
  const tagsQuery = await pool.query(`
    SELECT t.title, tg.name as tag_name
    FROM tasks t
    JOIN task_tags tt ON t.id = tt.task_id
    JOIN tags tg ON tt.tag_id = tg.id;
  `);
  console.log("Tasks with tags:", tagsQuery.rows);
}

async function main() {
  await resetDb();

  console.log("\n--- Running Drill Set 1 ---");
  await drillSet1();

  console.log("\n--- Running Drill Set 2 ---");
  await drillSet2();

  await pool.end();
}

main();
