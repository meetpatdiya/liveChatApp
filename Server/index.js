import cors from "cors";
import http from "http";
import db from "./config/db.js";
import { Server } from "socket.io";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import createRoutes from "./routes/createRoutes.js";
import cookieParser from "cookie-parser";
import isauth from "./middleware/isauth.js";
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
  await db
    .promise()
    .query("UPDATE users SET is_online = true WHERE id = ?", [userId]);
  io.emit("userOnline", userId);
  socket.on("disconnect", async () => {
    await db
      .promise()
      .query(
        "UPDATE users SET is_online = false, last_seen = NOW() WHERE id = ?",
        [userId],
      );
    io.emit("userOffline", {
      userId,
      lastSeen: new Date(),
    });
  });
});
app.use(express.json());
app.use(cookieParser());
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
server.listen(3000, () => {
  console.log("Server Running");
});
process.on("SIGINT", async () => {
  console.log("Closing MySQL pool...");
  await db.end();
  process.exit(0);
});
