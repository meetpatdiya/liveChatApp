import redisConnection from "../config/redis.js";
async function testRedis() {
  try {
    const result = await redisConnection.ping();
    console.log("Redis connected:", result);
  } catch (error) {
    console.error("Redis connection failed:", error.message);
  } finally {
    await redisConnection.quit();
  }
}

testRedis();