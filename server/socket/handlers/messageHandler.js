const { createRoom } = require("../roomManager");
const cookieUtils = require("../utils/cookieUtils");

const handleMessage = (io, socket) => {
  // Handle sending messages
  socket.on("sendMessage", ({ room, message, timestamp, sender }) => {
    const userUUID = cookieUtils.getUserUUID(socket);
    const newMessage = {
      sender: userUUID,
      message,
      timestamp,
      sender,
    };
    const roomData = createRoom(room);
    roomData.messages.push(newMessage); // Save the message in memory
    socket.broadcast.to(room).emit("receiveMessage", newMessage);
  });
};

module.exports = { handleMessage };
