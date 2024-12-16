const { handleSocketConnection } = require("./handlers/connectionHandler");
const { handleMessage } = require("./handlers/messageHandler");
const { handleRoom } = require("./handlers/roomHandler");
const { handleUser } = require("./handlers/userHandler");

const handleSockets = (io) => {
  io.on("connection", async (socket) => {
    await handleSocketConnection(io, socket);
    handleMessage(io, socket);
    handleRoom(io, socket);
    handleUser(io, socket);
  });
};

module.exports = { handleSockets };
