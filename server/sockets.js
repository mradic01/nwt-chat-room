const crypto = require("crypto");
const cookie = require("cookie");

const {
  createRoom,
  joinRoom,
  leaveRoom,
  getRoomUsers,
} = require("./socket/roomManager");

const handleSockets = (io) => {
  io.engine.on("headers", (headers, request) => {
    if (!request.headers.cookie) return;
    const cookies = cookie.parse(request.headers.cookie);
    if (!cookies.userUUID) {
      headers["set-cookie"] = cookie.serialize(
        "userUUID",
        crypto.randomUUID(),
        {
          maxAge: 86400,
        }
      );
    }
  });

  io.on("connection", (socket) => {
    // get cookie
    let userUUID;
    if (socket.request.headers.cookie)
      userUUID = cookie.parse(socket.request.headers.cookie)?.userUUID;

    // Automatically join the "Global" room
    joinRoom("Global", socket);
    broadcastRoomCounts(io);

    // Send existing messages for the room
    socket.emit("loadMessages", createRoom("Global").messages);

    // Handle sending messages
    socket.on("sendMessage", ({ room, message, sender }) => {
      const newMessage = { sender, message };
      const roomData = createRoom(room);
      roomData.messages.push(newMessage); // Save the message in memory
      io.to(room).emit("receiveMessage", newMessage);
    });

    // Handle room creation
    socket.on("createRoom", (roomName) => {
      const roomData = createRoom(roomName);
      if (roomData) {
        io.emit("roomCreated", roomName);
        broadcastRoomCounts(io);
      }
    });

    // Handle joining a room
    socket.on("joinRoom", (roomName) => {
      const prevRoom = leaveRoom(socket);
      if (joinRoom(roomName, socket)) {
        broadcastRoomCounts(io); // Update counts for all rooms
        socket.emit("joinedRoom", roomName);
        socket.emit("loadMessages", createRoom(roomName).messages);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      const room = leaveRoom(socket);
      broadcastRoomCounts(io); // Update counts for all rooms
      // console.log("User disconnected:", socket.id);
    });
  });
};

// Utility to broadcast room counts to all clients
const broadcastRoomCounts = (io) => {
  const roomCounts = getRoomConnectionCounts(io);
  io.emit("roomSummary", roomCounts);
};

// Utility to retrieve room connection counts
const getRoomConnectionCounts = (io) => {
  const roomCounts = {};
  for (const [roomName, roomDetails] of io.sockets.adapter.rooms) {
    if (io.sockets.adapter.sids.has(roomName)) continue; // Ignore individual socket rooms
    roomCounts[roomName] = roomDetails.size;
  }
  return roomCounts;
};

module.exports = { handleSockets };
