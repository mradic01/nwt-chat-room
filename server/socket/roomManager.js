const rooms = { Global: { messages: [], users: [] } };

// Create a new room or get the existing room data
const createRoom = (roomName = null) => {
  if (roomName && !rooms[roomName]) {
    rooms[roomName] = { messages: [], users: [] };
  }
  return roomName ? rooms[roomName] : rooms;
};

// Join a room: Add the socket user to the room and make them part of the room's "users"
const joinRoom = (roomName, socket) => {
  const room = createRoom(roomName); // Ensure the room exists
  if (room && !room.users.includes(socket.id)) {
    room.users.push(socket.id);
    socket.join(roomName); // Socket joins the room
    return true;
  }
  return false;
};

// Leave a room: Remove the socket user from the room and clean up
const leaveRoom = (socket) => {
  for (const roomName of Object.keys(rooms)) {
    const room = rooms[roomName];
    const index = room.users.indexOf(socket.id); // Find the socket in the room's user list
    if (index > -1) {
      room.users.splice(index, 1); // Remove socket from the room
      socket.leave(roomName); // Socket leaves the room
      return roomName;
    }
  }
  return null;
};

// Get all users currently in a specific room
const getRoomUsers = (roomName) => {
  return rooms[roomName]?.users || [];
};

// Get all rooms' user counts
const getRoomConnectionCounts = () => {
  const roomCounts = {};
  for (const [roomName, roomDetails] of Object.entries(rooms)) {
    roomCounts[roomName] = roomDetails.users.length; // Store the number of users in each room
  }
  return roomCounts;
};

module.exports = {
  createRoom,
  joinRoom,
  leaveRoom,
  getRoomUsers,
  getRoomConnectionCounts,
};
