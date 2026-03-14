import { Pool, PoolClient } from "pg";
import dotenv from "dotenv";

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function resetDb() {
  // Drop and recreate tables to prevent schema mismatch errors
  await pool.query(`DROP TABLE IF EXISTS tasks, projects, users CASCADE;`);
  await pool.query(`
    CREATE TABLE users (id SERIAL PRIMARY KEY, email TEXT UNIQUE);
    CREATE TABLE projects (id SERIAL PRIMARY KEY, name TEXT);
    CREATE TABLE tasks (id SERIAL PRIMARY KEY, title TEXT, user_id INTEGER REFERENCES users(id), project_id INTEGER REFERENCES projects(id), completed BOOLEAN DEFAULT FALSE);
  `);
}

// Create abstract BaseRepository<T> class with common CRUD methods.
abstract class BaseRepository<T> {
  constructor(protected tableName: string) {}

  async findById(
    id: number,
    client: Pool | PoolClient = pool,
  ): Promise<T | null> {
    const res = await client.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,[id],
    );
    return res.rows[0] || null;
  }

  async delete(id: number, client: Pool | PoolClient = pool): Promise<void> {
    await client.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
  }
}

interface User {
  id: number;
  email: string;
}

interface Project {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  user_id?: number;
  project_id?: number;
  completed: boolean;
}

// Implement UserRepository extending the base with user-specific methods.
class UserRepository extends BaseRepository<User> {
  constructor() {
    super("users");
  }

  async create(email: string, client: Pool | PoolClient = pool): Promise<User> {
    const res = await client.query(
      "INSERT INTO users (email) VALUES ($1) RETURNING *",
      [email],
    );
    return res.rows[0];
  }
}

class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super("projects");
  }

  async create(name: string, client: Pool | PoolClient = pool): Promise<Project> {
    const res = await client.query(
      "INSERT INTO projects (name) VALUES ($1) RETURNING *",
      [name],
    );
    return res.rows[0];
  }
}

// Implement TaskRepository with methods like findByUser(), markComplete().
class TaskRepository extends BaseRepository<Task> {
  constructor() {
    super("tasks");
  }

  async findByUser(
    userId: number,
    client: Pool | PoolClient = pool,
  ): Promise<Task[]> {
    const res = await client.query("SELECT * FROM tasks WHERE user_id = $1", [
      userId,
    ]);
    return res.rows;
  }

  async markComplete(
    taskId: number,
    client: Pool | PoolClient = pool,
  ): Promise<void> {
    await client.query("UPDATE tasks SET completed = true WHERE id = $1", [
      taskId,
    ]);
  }

  async create(
    title: string,
    projectId: number,
    client: Pool | PoolClient = pool,
  ): Promise<Task> {
    const res = await client.query(
      "INSERT INTO tasks (title, project_id) VALUES ($1, $2) RETURNING *",
      [title, projectId],
    );
    return res.rows[0];
  }
}

// Mock repositories for unit testing.
class MockUserRepository {
  private users: User[] =[];
  
  async findById(id: number) {
    return this.users.find((u) => u.id === id) || null;
  }
  
  async create(email: string) {
    const newUser = { id: this.users.length + 1, email };
    this.users.push(newUser);
    return newUser;
  }
}

// Create a transaction wrapper function withTransaction(fn).
async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Handle transaction isolation levels for concurrent operations.
    await client.query("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");

    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    // Test rollback behavior when second operation fails.
    await client.query("ROLLBACK");
    console.error("Transaction rolled back due to error.");
    throw error;
  } finally {
    client.release();
  }
}

// Add deadlock detection and retry logic.
async function withRetryTransaction<T>(
  fn: (client: PoolClient) => Promise<T>,
  maxRetries = 3,
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await withTransaction(fn);
    } catch (error: any) {
      if (error.code === "40P01" && attempt < maxRetries) {
        console.log(`Deadlock detected. Retrying transaction (Attempt ${attempt + 1})...`);
        await new Promise((res) => setTimeout(res, attempt * 100));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Transaction failed after maximum retries");
}

async function runDrill3And4() {
  await resetDb();

  // Use dependency injection to pass repositories to route handlers.
  const projectRepo = new ProjectRepository();
  const taskRepo = new TaskRepository();

  try {
    // Implement createProjectWithTasks() that creates project + initial tasks atomically.
    await withRetryTransaction(async (client) => {
      const project = await projectRepo.create("Website Redesign", client);
      console.log(`Created project inside transaction: ${project.name}`);

      await taskRepo.create("Setup Database", project.id, client);
      console.log(`Created initial task inside transaction.`);

      // Uncommenting the next line will trigger the rollback
      // throw new Error("Simulated application crash during transaction");
    });
  } catch (err: any) {
    console.log(`Transaction caught error: ${err.message}`);
  }
}

async function main() {
  console.log("\n Running Drills 3 & 4 ");
  await runDrill3And4();

  console.log("Closing database connections.");
  await pool.end();
}

main();