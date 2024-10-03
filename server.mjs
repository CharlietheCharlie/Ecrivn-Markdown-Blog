import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { resolve } from "path";  // 引入 path 模組

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("New client connected" + socket.id);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`Client joined room: ${roomId}`);
    });

    socket.on("privateMessage", async (msg) => {
      const { roomId, sender, message } = msg;
      console.log(`Private message from ${sender.id}: ${message}`);
      io.to(roomId).emit("newMessage", { sender, message });

    });

    socket.on("disconnect", ( reason) => {
      console.log("Client disconnected" + socket.id + reason);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
