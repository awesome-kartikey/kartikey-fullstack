import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import request from "supertest";
import pg from "pg";
import { app } from "./app.js";

let container: StartedPostgreSqlContainer;
let pool: pg.Pool;

// --- API Implementation ---
app.post("/users", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *",
      [req.body.email, req.body.name],
    );
    res.status(201).json(rows[0]);
  } catch (err: any) {
    if (err.code === "23505") {
      // Drill 2: Unique violation
      next({ status: 400, title: "Conflict", message: "Email already exists" });
    } else {
      next({
        status: 503,
        title: "Database Down",
        message: "Service Unavailable",
      });
    }
  }
});

app.get("/users/:id", async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.params.id,
    ]);
    if (!rows.length)
      return next({ status: 404, title: "Not Found", message: "User missing" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

app.get("/users", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const { rows } = await pool.query(
      "SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset],
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// --- Tests ---
describe("Database & API Integration", () => {
  beforeAll(async () => {
    container = await new PostgreSqlContainer("postgres:15").start();
    pool = new pg.Pool({ connectionString: container.getConnectionUri() });

    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL
      )
    `);
  }, 30000); // 30s timeout for downloading docker image

  afterAll(async () => {
    await pool.end();
    await container.stop();
  });

  beforeEach(async () => {
    // Drill 2: Truncate tables between tests
    await pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
  });

  it("POST /users creates a user and GET /users/:id retrieves it", async () => {
    const postRes = await request(app)
      .post("/users")
      .send({ email: "test@test.com", name: "Alice" });
    expect(postRes.status).toBe(201);
    expect(postRes.body.email).toBe("test@test.com");

    const getRes = await request(app).get(`/users/${postRes.body.id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.name).toBe("Alice");
  });

  it("returns 400 RFC 7807 error on duplicate email insert", async () => {
    await request(app)
      .post("/users")
      .send({ email: "dup@test.com", name: "Bob" });
    const res = await request(app)
      .post("/users")
      .send({ email: "dup@test.com", name: "Bob 2" });

    expect(res.status).toBe(400);
    expect(res.body.title).toBe("Conflict"); // RFC 7807 validation
  });

  it("returns 404 for missing ID", async () => {
    const res = await request(app).get("/users/999");
    expect(res.status).toBe(404);
  });

  it("handles pagination query params", async () => {
    // Drill 3: Seed DB
    await pool.query(
      "INSERT INTO users (email, name) VALUES ('1@t.com','A'), ('2@t.com','B'), ('3@t.com','C')",
    );

    const res = await request(app).get("/users?limit=2&offset=1");
    expect(res.body).toHaveLength(2);
    expect(res.body[0].name).toBe("B");
  });

  it("forces a transaction rollback safely", async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        "INSERT INTO users (email, name) VALUES ('roll@t.com', 'Rollback')",
      );
      throw new Error("Simulated failure");
    } catch {
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }

    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = 'roll@t.com'",
    );
    expect(rows).toHaveLength(0); // Drill 5: Assert data isn't persisted
  });

  it("returns 503 when Database is down", async () => {
    await container.stop(); // Drill 5: Simulate DB down (Kill container)

    const res = await request(app)
      .post("/users")
      .send({ email: "fail@test.com", name: "Fail" });
    expect(res.status).toBe(503);
    expect(res.body.title).toBe("Database Down");
  });
});
