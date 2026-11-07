import dotenv from "dotenv";
dotenv.config();
import { describe, test, expect, vi, beforeAll, afterAll, afterEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import server from "../index.js";
import db from "../config/db.js";
import redisConnection from "../config/redis.js";
import notificationQueue from "../others/notificationQueue.js";
import {
  addUser,
  getSocketId,
  isUserOnline,
  removeUserById,
} from "../models/socketManager.js";

describe(" Integration Tests - Real Redis & Express HTTP Endpoints", () => {
  let consoleSpy;
  const TEST_USER_ID = 88888;
  const TEST_SOCKET_ID = "socket_real_test_xyz";

  beforeAll(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(async () => {
    await redisConnection.hdel("active_users", String(TEST_USER_ID));
  });

  afterAll(async () => {
    consoleSpy.mockRestore();
    await notificationQueue.close();
    await redisConnection.quit();
    await db.promise().end();
  });

  describe("Real Redis: Socket Manager & Active Users", () => {
    test("addUser stores real session data in Redis hash 'active_users'", async () => {
      await addUser(TEST_USER_ID, TEST_SOCKET_ID);

      const rawData = await redisConnection.hget("active_users", String(TEST_USER_ID));
      expect(rawData).not.toBeNull();

      const parsed = JSON.parse(rawData);
      expect(parsed.socketId).toBe(TEST_SOCKET_ID);
      expect(parsed.connectedAt).toBeDefined();
    });

    test("getSocketId retrieves socket ID from real Redis", async () => {
      await addUser(TEST_USER_ID, TEST_SOCKET_ID);

      const socketId = await getSocketId(TEST_USER_ID);
      expect(socketId).toBe(TEST_SOCKET_ID);
    });

    test("isUserOnline returns true for active user and false when removed", async () => {
      await addUser(TEST_USER_ID, TEST_SOCKET_ID);
      const onlineBefore = await isUserOnline(TEST_USER_ID);
      expect(onlineBefore).toBe(true);

      await removeUserById(TEST_USER_ID);

      const onlineAfter = await isUserOnline(TEST_USER_ID);
      expect(onlineAfter).toBe(false);

      const rawData = await redisConnection.hget("active_users", String(TEST_USER_ID));
      expect(rawData).toBeNull();
    });
  });

  describe("Real Redis: BullMQ Notification Queue", () => {
    test("adds a real job to BullMQ notificationQueue in Redis", async () => {
      const jobPayload = {
        messageId: 99999,
        senderId: 1,
        receiverId: 2,
        type: "test_notification",
      };

      // once processed, avoiding lock conflicts with active workers.
      const job = await notificationQueue.add("testNotification", jobPayload, {
        removeOnComplete: true,
        removeOnFail: true,
      });

      expect(job.id).toBeDefined();
      expect(job.name).toBe("testNotification");
      expect(job.data).toEqual(jobPayload);
    });
  });

  describe("Authentication Guard (Protected Root)", () => {
    test("GET / without token returns 401", async () => {
      const res = await request(server).get("/");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Token does not exist");
    });

    test("GET / with valid accessToken cookie returns 200", async () => {
      const validToken = jwt.sign(
        { id: 1, email: "tester@example.com" },
        process.env.ACCESS_SECRET || "accesssecrate"
      );

      const res = await request(server)
        .get("/")
        .set("Cookie", [`accessToken=${validToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("hey");
    });
  });

  describe("POST /auth/register Validation", () => {
    test("returns 400 when name, email, or password is missing", async () => {
      const res = await request(server)
        .post("/auth/register")
        .send({ email: "user@example.com" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("please provide valid credentials");
    });

    test("returns 400 on invalid email format", async () => {
      const res = await request(server)
        .post("/auth/register")
        .send({ name: "Tester", email: "bad-email", password: "password123" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("invalid email formate");
    });

    test("returns 400 when name or password is too short", async () => {
      const res = await request(server)
        .post("/auth/register")
        .send({ name: "Al", email: "al@example.com", password: "123" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("name or password too short");
    });
  });

  describe("POST /auth/login Validation", () => {
    test("returns 400 when credentials are empty", async () => {
      const res = await request(server).post("/auth/login").send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("please provide ok ok credentials");
    });

    test("returns 400 on invalid email", async () => {
      const res = await request(server)
        .post("/auth/login")
        .send({ email: "invalid-mail", password: "password123" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("invalid email formate");
    });

    test("returns 400 when password is under 7 characters", async () => {
      const res = await request(server)
        .post("/auth/login")
        .send({ email: "valid@example.com", password: "short" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("password must be 8 charachters long");
    });
  });

  describe("POST /auth/logout", () => {
    test("clears cookies and returns 200", async () => {
      const res = await request(server).post("/auth/logout");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logout successful");

      const cookies = res.headers["set-cookie"];
      expect(cookies).toBeDefined();
    });
  });

  describe("Protected Module Routes", () => {
    test("GET /chat/groups without auth returns 401", async () => {
      const res = await request(server).get("/chat/groups");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Token does not exist");
    });

    test("GET /search without auth returns 401", async () => {
      const res = await request(server).get("/search");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Token does not exist");
    });

    test("POST /block/user without auth returns 401", async () => {
      const res = await request(server).post("/block/user");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Token does not exist");
    });
  });
});
