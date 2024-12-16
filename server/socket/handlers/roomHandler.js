const { createRoom, joinRoom, leaveRoom } = require("../roomManager");
const { broadcastRoomCounts } = require("../utils/roomUtils");

const handleRoom = (io, socket) => {
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
};

module.exports = { handleRoom };
