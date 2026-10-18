import notificationQueue from "./notificationQueue.js";
async function addJob() {
  try {
    const job = await notificationQueue.add(
      "createNotification",
      {
        receiverId:3,
        senderId: 17,
        messageId: 175,
        conversationId:1,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      }
    );

    console.log("Job added successfully:", job.id);
  } catch (error) {
    console.error("Failed to add job:", error.message);
  } finally {
    await notificationQueue.close();
  }
}

addJob();