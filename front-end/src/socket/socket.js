import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACK_END, {
  withCredentials: true,
});

export default socket;
