import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { prismaClient } from "@repo/db/client";
import { authenticateSocket } from "./middleware/authSocket";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 4000;

const io = new Server(httpServer, {
  cors: {
    origin: process.env.ORIGIN_URL || "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type", "Set-Cookie"],
  },
});

// Apply proper authentication middleware
authenticateSocket(io);

const roomUsers: Record<
  string,
  { id: string; name: string; userId: string }[]
> = {};

io.on("connection", (socket) => {
  const roomId = socket.handshake.query.roomId as string;
  if (!roomId) {
    socket.disconnect(true);
    return;
  }

  socket.join(roomId);

  if (!roomUsers[roomId]) roomUsers[roomId] = [];
  roomUsers[roomId].push({
    id: socket.id,
    name: socket.data.user.name,
    userId: socket.data.user.id,
  });

  console.log("Users in room:", roomUsers);

  socket.broadcast.to(roomId).emit("user-joined", {
    name: socket.data.user.name,
    users: roomUsers[roomId],
  });

  socket.on("get-users", (roomId: string) => {
    if (!roomId) return;
    socket.emit("online-user", {
      name: socket.data.user.name,
      users: roomUsers[roomId],
    });
  });

  socket.on("draw", async (data: { shape: any; roomId: string }) => {
    socket.broadcast.to(data.roomId).emit("draw", data.shape);
    const { roomId, shape } = data;
    if (!roomId || !shape) return;

    try {
      if (shape.type === "line") {
        await prismaClient.shape.create({
          data: {
            type: shape.type,
            documentId: roomId,
            x: shape.x,
            y: shape.y,
            x2: shape.x2,
            y2: shape.y2,
          },
        });
      } else if (shape.type === "freehand") {
        await prismaClient.shape.create({
          data: { type: shape.type, documentId: roomId, points: shape.points },
        });
      } else {
        await prismaClient.shape.create({
          data: {
            type: shape.type,
            documentId: roomId,
            x: shape.x,
            y: shape.y,
            width: shape.width,
            height: shape.height,
          },
        });
      }
    } catch (err) {
      console.error("Failed to save shape:", err);
    }
  });

  function generateRandomColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 80%, 70%)`;
  }

  socket.on("cursor-move", (data: { x: number; y: number; roomId: string }) => {
    socket.broadcast.to(data.roomId).emit("cursor-move", {
      userId: socket.data.user.id,
      x: data.x,
      y: data.y,
      userName: socket.data.user.name,
      roomId: data.roomId,
      color: generateRandomColor(socket.data.user.name),
    });
  });

  socket.on("clear-canvas", ({ roomId }: { roomId: string }) => {
    socket.to(roomId).emit("clear-canvas", { roomId });
  });

  socket.on("undo-shape", ({ roomId }: { roomId: string }) => {
    io.to(roomId).emit("undo-shape");
  });

  socket.on("redo-shape", ({ roomId }: { roomId: string }) => {
    io.to(roomId).emit("redo-shape");
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.data.user.name} disconnected`);
    for (const roomId in roomUsers) {
      if (!roomUsers[roomId]) continue;
      roomUsers[roomId] = roomUsers[roomId].filter(
        (user) => user.id !== socket.id
      );

      socket.broadcast.to(roomId).emit("user-left", {
        name: socket.data.user.name,
        users: roomUsers[roomId],
      });

      socket.broadcast.to(roomId).emit("cursor-remove", {
        userId: socket.data.user.id,
      });
    }
    console.log("Updated room users:", roomUsers);
  });
});

httpServer.listen(PORT, () => {
  console.log(`WS server running on port ${PORT}`);
});
