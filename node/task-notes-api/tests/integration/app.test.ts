import request from "supertest";
import { beforeAll, describe, expect, it, afterAll } from "vitest";
import { createApp } from "../../src/server.js";
import { UserRepository } from "../../src/repositories/UserRepository.js";
import { TaskRepository } from "../../src/repositories/TaskRepository.js";
import { AuthService } from "../../src/authservice.js";

import { TaskScheduler } from "../../src/jobs/scheduler.js";
import { closeDb } from "../../src/database.js";

let app: any;
let scheduler: TaskScheduler;

beforeAll(() => {
  const userRepo = new UserRepository();
  const taskRepo = new TaskRepository();
  const authService = new AuthService(userRepo);
  scheduler = new TaskScheduler();
  app = createApp({ authService, userRepo, taskRepo, scheduler });
});

afterAll(async () => {
  await scheduler?.close();
  await closeDb();
});

let accessToken = "";
const email = `u${Date.now()}@test.com`;
const password = "password123";

describe("api smoke tests", () => {
  beforeAll(async () => {
    await request(app).post("/api/auth/register").send({ email, password });
    const login = await request(app).post("/api/auth/login").send({ email, password });
    accessToken = login.body.token;
  });

  it("healthz works", async () => {
    const res = await request(app).get("/healthz");
    expect(res.status).toBe(200);
  });

  it("readyz exists", async () => {
    const res = await request(app).get("/readyz");
    expect([200, 503]).toContain(res.status);
  });

  it("health/db works", async () => {
    const res = await request(app).get("/health/db");
    expect(res.status).toBe(200);
  });

  it("openapi.json exists", async () => {
    const res = await request(app).get("/openapi.json");
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe("3.0.0");
  });

  it("tasks require auth", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(401);
  });

  it("can create task with auth", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "Test Task", priority: "high" });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test Task");
  });

  it("metrics works", async () => {
    const res = await request(app).get("/metrics");
    expect(res.status).toBe(200);
    expect(res.text).toContain("http_requests_total");
  });

  it("handles DB constraint errors with standard problem+json", async () => {
    const res = await request(app).post("/api/auth/register").send({ email, password });
    expect(res.status).toBe(409);
    expect(res.body.type).toContain("/problems/conflict");
    expect(res.body.detail).toBe("Email already exists");
  });
});
