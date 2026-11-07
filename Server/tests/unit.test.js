import dotenv from "dotenv";
dotenv.config();
import { describe, test, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import AppError from "../middleware/appError.js";
import errorMiddleware from "../middleware/errorMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";
import isauth from "../middleware/isauth.js";

vi.mock("../config/redis.js", () => {
  return {
    default: {
      on: vi.fn(),
      hset: vi.fn(),
      hget: vi.fn(),
      hdel: vi.fn(),
      hexists: vi.fn(),
      hgetall: vi.fn(),
    },
  };
});
import redisConnection from "../config/redis.js";
import {
  addUser,
  getSocketId,
  isUserOnline,
  removeUserById,
} from "../models/socketManager.js";

describe(" Unit Tests", () => {
  describe("AppError Class", () => {
    test("instantiates with message and statusCode", () => {
      const err = new AppError("Invalid credentials", 400);
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Invalid credentials");
      expect(err.statusCode).toBe(400);
    });

    test("handles 500 error creation", () => {
      const err = new AppError("Server crashed", 500);
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Server crashed");
      expect(err.statusCode).toBe(500);
    });
  });

  describe("asyncHandler Middleware", () => {
    test("calls the provided async function successfully", async () => {
      const fn = vi.fn().mockResolvedValue("success");
      const req = {};
      const res = {};
      const next = vi.fn();

      const wrapped = asyncHandler(fn);
      await wrapped(req, res, next);

      expect(fn).toHaveBeenCalledWith(req, res, next);
      expect(next).not.toHaveBeenCalled();
    });

    test("catches errors and passes them to next()", async () => {
      const expectedError = new Error("Async failure");
      const fn = vi.fn().mockRejectedValue(expectedError);
      const req = {};
      const res = {};
      const next = vi.fn();

      const wrapped = asyncHandler(fn);
      await wrapped(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("errorMiddleware", () => {
    test("formats response with error's status code and message", () => {
      const err = new AppError("Resource not found", 404);
      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const next = vi.fn();

      // Suppress console.log during test
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      errorMiddleware(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Resource not found",
      });

      consoleSpy.mockRestore();
    });

    test("defaults to status 500 and 'Internal Server Error' if unspecified", () => {
      const err = new Error();
      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const next = vi.fn();
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      errorMiddleware(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal Server Error",
      });

      consoleSpy.mockRestore();
    });
  });

  describe("isauth Middleware", () => {
    test("returns 401 when accessToken cookie is missing", () => {
      const req = { cookies: {} };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const next = vi.fn();

      isauth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Token does not exist" });
      expect(next).not.toHaveBeenCalled();
    });

    test("returns 401 when token verification fails", () => {
      const req = { cookies: { accessToken: "invalid-token" } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const next = vi.fn();

      vi.spyOn(jwt, "verify").mockImplementation((token, secret, callback) => {
        callback(new Error("jwt expired"), null);
      });

      isauth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
      expect(next).not.toHaveBeenCalled();
    });

    test("populates req.user and calls next() on valid token", () => {
      const mockPayload = { id: 42, email: "user@test.com" };
      const req = { cookies: { accessToken: "valid-token" } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const next = vi.fn();

      vi.spyOn(jwt, "verify").mockImplementation((token, secret, callback) => {
        callback(null, mockPayload);
      });

      isauth(req, res, next);

      expect(req.user).toEqual(mockPayload);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("socketManager Functions (Mocked Redis)", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    test("addUser stores serialized user data in Redis", async () => {
      redisConnection.hset.mockResolvedValue(1);

      await addUser(10, "socket_abc_123");

      expect(redisConnection.hset).toHaveBeenCalledWith(
        "active_users",
        "10",
        expect.stringContaining('"socketId":"socket_abc_123"')
      );
    });

    test("getSocketId returns socketId when user exists", async () => {
      redisConnection.hget.mockResolvedValue(
        JSON.stringify({ socketId: "socket_test_99" })
      );

      const socketId = await getSocketId(10);
      expect(socketId).toBe("socket_test_99");
      expect(redisConnection.hget).toHaveBeenCalledWith("active_users", "10");
    });

    test("getSocketId returns null when user is not found", async () => {
      redisConnection.hget.mockResolvedValue(null);

      const socketId = await getSocketId(999);
      expect(socketId).toBeNull();
    });

    test("isUserOnline returns true if key exists in Redis", async () => {
      redisConnection.hexists.mockResolvedValue(1);

      const online = await isUserOnline(10);
      expect(online).toBe(true);
      expect(redisConnection.hexists).toHaveBeenCalledWith("active_users", "10");
    });

    test("removeUserById removes key from Redis", async () => {
      redisConnection.hdel.mockResolvedValue(1);

      await removeUserById(10);
      expect(redisConnection.hdel).toHaveBeenCalledWith("active_users", "10");
    });
  });
});
