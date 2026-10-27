import { Worker } from "bullmq";
import redisConnection from "../config/redis.js";
import db from "../config/db.js";
import { getSocketId } from "../models/socketManager.js";

export const initNotificationWorker = (io) => {

  const notificationWorker = new Worker(
    "notificationQueue",
    async (job) => {
      const { messageId, senderId, receiverId, conversationId, type="reaction" } = job.data;

      if (job.name === "createNotification") {
        console.log("Processing notification:", job.id);

        await db.promise().query(
          `INSERT INTO notification
          (user_id,sender_id,type,message_id,conversation_id)
         VALUES (?, ?, ?, ?, ?)`,
          [receiverId, senderId, type, messageId, conversationId]
        );

        console.log("Notification created successfully");

        if (io) {
          const payload = {
            type,
            senderId,
            receiverId,
            messageId,
            conversationId,
          };

          // 1. Send directly to receiver if they are online anywhere in the app
          const receiverSocketId = await getSocketId(Number(receiverId));
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("newNotification", payload);
          }

          // 2. Also emit to conversation room if active
          if (conversationId) {
            io.to(String(conversationId)).emit("newNotification", payload);
          }
        }
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
  return notificationWorker;
}
