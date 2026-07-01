import cors from "cors";
import http from "http";
import db from "./config/db.js";
import { Server } from "socket.io";
import express from "express";
import {rateLimit} from "express-rate-limit"
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import createRoutes from "./routes/createRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import isauth from "./middleware/isauth.js";
import { addUser, removeUser,getSocketId,getOnlineUsers } from "./models/socketManager.js";
import { globalLimiter } from "./middleware/Loginlimit.js";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
app.set("io", io);
io.on("connection", async (socket) => {
  const userId = socket.handshake.auth.userId;
  addUser(Number(userId), socket.id);
  await db
    .promise()
    .query("UPDATE users SET is_online = true WHERE id = ?", [userId]);
  await db
    .promise()
    .query(
      "UPDATE message_status set status = 'delivered' where user_id = ? and status ='sent'",
      [userId],
    );
  const [showOthers] = await db
    .promise()
    .query(
      "Select distinct m.sender_id from messages m join message_status ms on m.id = ms.message_id where ms.status = 'delivered' and ms.user_id = ?",
      [userId],
    );
   for (const user of showOthers) {
  const senderSocket = getSocketId(user.sender_id);
  if (senderSocket) {
    io.to(senderSocket).emit("messagesDelivered", {
      receiverId: Number(userId),
    });
  }
}
socket.on(`messagesRead`, async (data) => {
  const { conversationId } = data;
   console.log("Socket userId:", userId);
  console.log("Conversation:", conversationId);
  console.log("hello");
  
  const [result] = await db.promise().query(
    `UPDATE message_status ms
     JOIN messages m ON m.id = ms.message_id
     SET ms.status = 'read',
         ms.seen_at = NOW()
     WHERE ms.user_id = ?
       AND m.conversation_id = ?
       AND ms.status = 'delivered'`,
    [userId, conversationId]
  );
  console.log(result.affectedRows);
});
  io.emit("userOnline", userId);
  socket.on("disconnect", async () => {
    await db
      .promise()
      .query(
        "UPDATE users SET is_online = false, last_seen = NOW() WHERE id = ?",
        [userId],
      );
    removeUser(socket.id);
    io.emit("userOffline", {
      userId,
      lastSeen: new Date(),
    });
  });
});
app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);
app.use("/auth", authRoutes);
app.use("/chat", isauth, chatRoutes);
app.use("/search", isauth, searchRoutes);
app.use("/create", isauth, createRoutes);
app.use("/user", isauth, userRoutes);
server.listen(3000, () => {
  console.log("Server Running");
});
process.on("SIGINT", async () => {
  console.log("Closing MySQL pool...");
  await db.end();
  process.exit(0);
});
