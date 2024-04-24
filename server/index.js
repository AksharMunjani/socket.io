const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Add a login route to authenticate users
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "password") {
    const token = jwt.sign({ username }, "secret_key");
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Socket.IO event handlers
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    jwt.verify(token, "secret_key", (err, decoded) => {
      if (err) {
        next(new Error("Authentication error"));
      } else {
        next();
      }
    });
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
