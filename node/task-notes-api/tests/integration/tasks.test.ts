import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { TaskServer } from "../../src/server";
import { loadConfig } from "../../src/config";
import { UserDatabase } from "../../src/database";
import { AuthService } from "../../src/auth/service";
import { FileStorage } from "../../src/storage";
import { TaskEventEmitter } from "../../src/events";
import fs from "fs/promises";

describe("Tasks API", () => {
  let app: any;
  let token: string;

  beforeEach(async () => {
    const config = loadConfig();
    // Use separate files for testing
    config.dbPath = "./data/test_users.db";
    config.dataPath = "./data/test_tasks.json";

    // Clean up old test data if it exists
    try {
      await fs.unlink(config.dbPath);
    } catch {}
    try {
      await fs.unlink(config.dataPath);
    } catch {}

    // Initialize dependencies
    const userDb = new UserDatabase(config.dbPath);
    const authService = new AuthService(userDb, config.jwtSecret);
    const storage = new FileStorage(config.dataPath);
    const events = new TaskEventEmitter();

    const server = new TaskServer(config, authService, storage, events, userDb);
    app = (server as any).app;

    // Create user and get token for the test
    await request(app)
      .post("/api/auth/register")
      .send({ email: "test@test.com", password: "pass" });
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@test.com", password: "pass" });
    token = login.body.token;
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
});
