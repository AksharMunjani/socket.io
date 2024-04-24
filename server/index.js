const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Socket.IO event handlers

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    next();
  } else {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  socket.on("chat message", (data) => {
    io.to(data.room).emit("chat message", data.msg);
  });

  socket.on("create room", (room) => {
    socket.join(room);
  });

  socket.on("join room", (room) => {
    socket.join(room);
  });

  socket.on("leave room", (room) => {
    socket.leave(room);
  });
});

server.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});
