const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log(`${socket.id} user connected`);

  socket.on("add-message", (msg) => {
    socket.nsp.emit("receive-message", {
      userId: socket.id,
      message: msg,
    });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} user disconnected`);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
