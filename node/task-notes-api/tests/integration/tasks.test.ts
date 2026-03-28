import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../../src/server.js";
import { UserRepository } from "../../src/repositories/UserRepository.js";
import { TaskRepository } from "../../src/repositories/TaskRepository.js";
import { AuthService } from "../../src/authservice.js";

import { TaskScheduler } from "../../src/jobs/scheduler.js";
import { db, closeDb } from "../../src/database.js";
import { users, tasks } from "../../src/db/schema.js";

describe("Tasks API", () => {
  let app: any;
  let token: string;
  let scheduler: TaskScheduler;

  beforeAll(async () => {
    // Clear db for tests
    await db.delete(tasks);
    await db.delete(users);

    const userRepo = new UserRepository();
    const taskRepo = new TaskRepository();
    const authService = new AuthService(userRepo);
    scheduler = new TaskScheduler();

    app = createApp({ authService, userRepo, taskRepo, scheduler });
  });

  afterAll(async () => {
    await scheduler.close();
    await closeDb();
  });

  beforeEach(async () => {
    const email = `tasks-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`;
    const password = "password123";

    const regRes = await request(app).post("/api/auth/register").send({ email, password });
    if (regRes.status !== 201) {
      console.error("Register failed", regRes.status, regRes.body);
    }

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email, password });

    token = login.body.token;
    if (!token) {
      console.error("Login failed during test setup", login.status, login.body);
    }
  });

  describe("POST /api/tasks", () => {
    it("creates task with valid data", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Test Task", priority: "high" });
      expect(res.status).toBe(201);
      expect(res.body.title).toBe("Test Task");
    });

    it("rejects invalid data", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "" }); // Invalid based on Zod schema
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/tasks", () => {
    it("supports offset pagination", async () => {
      // Create a few tasks
      await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Task 1", priority: "high" });
      await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Task 2", priority: "low" });

      const res1 = await request(app)
        .get("/api/tasks?limit=1&page=1")
        .set("Authorization", `Bearer ${token}`);
      expect(res1.status).toBe(200);
      expect(res1.body.items).toHaveLength(1);

      const res2 = await request(app)
        .get("/api/tasks?limit=1&page=2")
        .set("Authorization", `Bearer ${token}`);
      expect(res2.status).toBe(200);
      expect(res2.body.items).toHaveLength(1);
      expect(res2.body.items[0].id).not.toBe(res1.body.items[0].id);
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("returns 404 for missing task", async () => {
      const res = await request(app)
        .get("/api/tasks/not-a-real-id")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
      expect(res.body.type).toContain("/problems/not-found");
    });
  });

  describe("PUT /api/tasks/:id", () => {
    it("returns 403 when updating another user's task", async () => {
      // Create task for user 1
      const createRes = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "My Task", priority: "high" });
      
      const taskId = createRes.body.id;

      // Register user 2
      const email2 = `tasks2-${Date.now()}@test.com`;
      await request(app).post("/api/auth/register").send({ email: email2, password: "password123" });
      const login2 = await request(app).post("/api/auth/login").send({ email: email2, password: "password123" });
      const token2 = login2.body.token;

      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${token2}`)
        .send({ title: "Hacked Task" });
      
      expect(res.status).toBe(403);
      expect(res.body.type).toContain("/problems/forbidden");
    });
  });
});
