const cookie = require("cookie");

const getUserUUID = (socket) => {
  if (socket.request.headers.cookie) {
    const cookies = cookie.parse(socket.request.headers.cookie);
    return cookies.userUUID;
  }
  return null;
};

module.exports = { getUserUUID };
