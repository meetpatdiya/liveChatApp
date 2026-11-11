import dotenv from "dotenv";
dotenv.config();
import { describe, test, expect, afterAll } from "vitest";
import cloudinary from "../config/cloudinaryConfig.js";
import db from "../config/db.js";
import redisConnection from "../config/redis.js";

describe("Smoke Tests - External Services & Environment", () => {
  test("Database Connection", async () => {
    const [rows] = await db.promise().query("SELECT 1=1 as status;");
    expect(rows[0].status).toBe(1);
  });

  test("Cloudinary API Connection", async () => {
    const response = await cloudinary.api.ping();
    expect(response.status).toBe("ok");
  });

  test("Redis Connection", async () => {
    const pong = await redisConnection.ping();
    expect(pong).toBe("PONG");
  });

  test("Required Environment Variables Exist", () => {
    const requiredEnvVars = [
      "MYSQLHOST",
      "MYSQLUSER",
      "MYSQL_DATABASE",
      "MYSQL_PASSWORD",
      "ACCESS_SECRET",
      "REFRESH_SECRET",
      "CLOUDINARY_CLOUD_NAME",
      "CLOUDINARY_API_KEY",
      "CLOUDINARY_API_SECRET",
    ];

    requiredEnvVars.forEach((envVar) => {
      expect(
        process.env[envVar],
        `Expected environment variable ${envVar} to be defined`
      ).toBeDefined();
      expect(
        process.env[envVar].length,
        `Expected ${envVar} not to be empty`
      ).toBeGreaterThan(0);
    });
  });

  afterAll(async () => {
    await db.promise().end();
    await redisConnection.quit();
  });
});
