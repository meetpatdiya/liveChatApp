import redisConnection from "../config/redis.js";

const ACTIVE_USERS_KEY = "active_users";

export const addUser = async (userId, socketId) => {
  const data = JSON.stringify({
    socketId,
    connectedAt: new Date().toISOString(),
  });
  await redisConnection.hset(ACTIVE_USERS_KEY, String(userId), data);
};

export const removeUser = async (identifier) => {
  // If numeric or numeric string (userId)
  if (!isNaN(identifier) && typeof identifier !== "object") {
    await redisConnection.hdel(ACTIVE_USERS_KEY, String(identifier));
    return;
  }
  // If socket.id string was passed
  const allUsers = await redisConnection.hgetall(ACTIVE_USERS_KEY);
  for (const [userId, rawData] of Object.entries(allUsers)) {
    try {
      const parsed = JSON.parse(rawData);
      if (parsed.socketId === identifier) {
        await redisConnection.hdel(ACTIVE_USERS_KEY, userId);
        break;
      }
    } catch {
      // Ignore parse error
    }
  }
};

export const removeUserById = async (userId) => {
  await redisConnection.hdel(ACTIVE_USERS_KEY, String(userId));
};

export const getSocketId = async (userId) => {
  const rawData = await redisConnection.hget(ACTIVE_USERS_KEY, String(userId));
  if (!rawData) return null;
  try {
    const parsed = JSON.parse(rawData);
    return parsed.socketId || null;
  } catch {
    return rawData;
  }
};

export const isUserOnline = async (userId) => {
  const exists = await redisConnection.hexists(ACTIVE_USERS_KEY, String(userId));
  return exists === 1;
};

export const getOnlineUsers = async () => {
  const keys = await redisConnection.hkeys(ACTIVE_USERS_KEY);
  return keys.map(Number);
};

export const getUserPresence = async (userId) => {
  const rawData = await redisConnection.hget(ACTIVE_USERS_KEY, String(userId));
  if (!rawData) return null;
  try {
    return JSON.parse(rawData);
  } catch {
    return null;
  }
};