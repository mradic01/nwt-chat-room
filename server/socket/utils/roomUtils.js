const { getRoomConnectionCounts } = require("../roomManager");

// Utility to broadcast room counts to all clients
const broadcastRoomCounts = (io) => {
  const roomCounts = getRoomConnectionCounts();

  io.emit("roomSummary", roomCounts);
};

module.exports = { broadcastRoomCounts };
