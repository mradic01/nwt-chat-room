const cookieUtils = require("../utils/cookieUtils");
const { leaveRoom } = require("../roomManager");
const { broadcastRoomCounts } = require("../utils/roomUtils");

const handleUser = (io, socket) => {
  // Handle user disconnection
  socket.on("disconnect", () => {
    const room = leaveRoom(socket);
    broadcastRoomCounts(io); // Update counts for all rooms
  });
};

module.exports = { handleUser };
