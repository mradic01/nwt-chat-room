const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const cookie = require("cookie");
const cors = require("cors");

const { handleSockets } = require("./socket/socket");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow localhost:5173
    methods: ["GET", "POST"], // Allow specific methods
    credentials: true,
    allowedHeaders: ["Content-Type"],
  },
  cookie: {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  },
});

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Initialize Socket.IO handlers
handleSockets(io);

app.get("/get-uuid", (req, res) => {
  const { userUUID } = req.cookies;

  let uuid = userUUID || crypto.randomUUID();

  if (!userUUID) {
    // Set a secure cookie with the newly generated UUID
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("userUUID", uuid, {
        httpOnly: true,
        secure: false,
        maxAge: 86400,
        path: "/",
        sameSite: "Lax",
      })
    );
  }

  res.status(201).json({ uuid });
});

// Start server on port 8080
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
