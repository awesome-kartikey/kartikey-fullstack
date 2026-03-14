import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function resetDb() {
  await pool.query(
    `DROP TABLE IF EXISTS denormalized_orders, normalized_orders, customers, tasks, users CASCADE;`,
  );
}

async function drillSet3() {
  // Start with a denormalized orders table: id, customer_name, customer_email, product_name, price.
  await pool.query(`
    CREATE TABLE denormalized_orders (
      id SERIAL PRIMARY KEY,
      customer_name TEXT,
      customer_email TEXT,
      product_name TEXT,
      price NUMERIC
    );
  `);

  // Insert several orders for the same customer - notice duplication.
  await pool.query(`
    INSERT INTO denormalized_orders (customer_name, customer_email, product_name, price) VALUES 
    ('Alice', 'alice@olddomain.com', 'Laptop', 1200), 
    ('Alice', 'alice@olddomain.com', 'Mouse', 25);
  `);

  // Normalize into customers and orders tables with foreign key.
  await pool.query(`
    CREATE TABLE customers (
      id SERIAL PRIMARY KEY, 
      name TEXT, 
      email TEXT UNIQUE
    );
    CREATE TABLE normalized_orders (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER REFERENCES customers(id),
      product_name TEXT,
      price NUMERIC
    );
  `);

  const customerRes = await pool.query(`
    INSERT INTO customers (name, email) VALUES ('Alice', 'alice@olddomain.com') RETURNING id;
  `);
  const customerId = customerRes.rows[0].id;

  await pool.query(
    `
    INSERT INTO normalized_orders (customer_id, product_name, price) VALUES 
    ($1, 'Laptop', 1200), 
    ($1, 'Mouse', 25);
  `,
    [customerId],
  );

  // Update customer email in one place, verify it updates for all orders.
  await pool.query(
    `UPDATE customers SET email = 'alice@newdomain.com' WHERE id = $1`,
    [customerId],
  );

  const verifyRes = await pool.query(`
    SELECT c.email, o.product_name 
    FROM normalized_orders o 
    JOIN customers c ON o.customer_id = c.id;
  `);
  console.log(
    "Normalized query result (email updated once for all orders):",
    verifyRes.rows,
  );

  // Compare query complexity: normalized vs. denormalized approaches.
  console.log(
    "Note: Denormalized reads are simpler (no JOIN), but writes/updates risk data inconsistency.",
  );
}

async function drillSet4() {
  await pool.query(`
    CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT);
    CREATE TABLE tasks (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id));
  `);

  const userRes = await pool.query(
    `INSERT INTO users (name) VALUES ('Bob') RETURNING id`,
  );
  const userId = userRes.rows[0].id;

  // Add task_count column to users table.
  await pool.query(
    `ALTER TABLE users ADD COLUMN task_count INTEGER DEFAULT 0;`,
  );

  // Create a function to update task count when tasks are added/removed.
  async function addTaskAndUpdateCount(userId: number, numberOfTasks: number) {
    // Insert 1000 tasks and measure query time difference.
    // Using generate_series instead of a JS loop for realistic DB performance
    const startInsert = performance.now();
    await pool.query(
      `
      INSERT INTO tasks (user_id) 
      SELECT $1 FROM generate_series(1, $2);
    `,
      [userId, numberOfTasks],
    );

    await pool.query(
      `
      UPDATE users SET task_count = task_count + $2 WHERE id = $1;
    `,
      [userId, numberOfTasks],
    );

    console.log(
      `Inserted ${numberOfTasks} tasks and updated count in ${Math.round(performance.now() - startInsert)}ms`,
    );
  }

  await addTaskAndUpdateCount(userId, 1000);

  // Compare performance: counting tasks live vs. using stored count.
  const startLive = performance.now();
  await pool.query(`SELECT COUNT(*) FROM tasks WHERE user_id = $1`, [userId]);
  const liveTime = performance.now() - startLive;

  const startCached = performance.now();
  await pool.query(`SELECT task_count FROM users WHERE id = $1`, [userId]);
  const cachedTime = performance.now() - startCached;

  console.log(`Live COUNT(*) execution time: ${liveTime.toFixed(3)}ms`);
  console.log(`Stored task_count execution time: ${cachedTime.toFixed(3)}ms`);

  // Discuss trade-offs: consistency vs. performance.
  console.log(
    "Trade-off note: Maintaining task_count slows down INSERT/DELETE operations and requires transactions, but drastically speeds up read-heavy dashboards.",
  );
}

async function main() {
  await resetDb();

  console.log("\n--- Running Drill Set 3 ---");
  await drillSet3();

  console.log("\n--- Running Drill Set 4 ---");
  await drillSet4();

  await pool.end();
}

main();
