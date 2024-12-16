const cookie = require("cookie");
const { joinRoom, createRoom } = require("../roomManager"); // Import createRoom
const { broadcastRoomCounts } = require("../utils/roomUtils"); // Correct import

const handleSocketConnection = async (io, socket) => {
  // Handle cookies when connection is made
  await io.engine.on("headers", (headers, request) => {
    if (!request.headers.cookie) return;
    const cookies = cookie.parse(request.headers.cookie);
    if (!cookies.userUUID) {
      headers["set-cookie"] = cookie.serialize(
        "userUUID",
        crypto.randomUUID(),
        {
          httpOnly: true,
          secure: false,
          maxAge: 86400,
          path: "/",
          sameSite: "Lax",
        }
      );
    }
  });

  // Automatically join the "Global" room
  joinRoom("Global", socket);
  broadcastRoomCounts(io); // Correctly calling the function

  // Send existing messages for the room
  socket.emit("loadMessages", createRoom("Global").messages);
};

module.exports = { handleSocketConnection };
