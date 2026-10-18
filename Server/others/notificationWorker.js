import { Worker } from "bullmq";
import redisConnection from "../config/redis.js";
import db from "../config/db.js";

const notificationWorker = new Worker(
  "notificationQueue",
  async (job) => {
    const { messageId, senderId, receiverId, conversationId } = job.data;

    if (job.name === "createNotification") {
      console.log("Processing notification:", job.id);

      await db.promise().query(
        `INSERT INTO notification
          (user_id,sender_id,type,message_id,conversation_id)
         VALUES (?, ?, ?, ?, ?)`,
        [receiverId, senderId, "reaction", messageId, conversationId]
      );

      console.log("Notification created successfully");
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

notificationWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

notificationWorker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed:`, error.message);
});

export default notificationWorker;