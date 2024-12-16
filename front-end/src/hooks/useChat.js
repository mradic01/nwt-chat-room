import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACK_END);

const useChat = () => {
  const [rooms, setRooms] = useState(["Global"]);
  const [room, setRoom] = useState("Global");
  const [messages, setMessages] = useState([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("joinedRoom", (newRoom) => {
      setRoom(newRoom);
      setMessages([]);
    });

    socket.on("loadMessages", (loadedMessages) => {
      setMessages(loadedMessages);
    });

    socket.on("updateUserCount", (count) => {
      setUserCount(count);
    });

    socket.on("roomCreated", (newRoom) => {
      setRooms((prev) => [...prev, newRoom]);
    });

    socket.on("roomSummary", (roomSummary) => {
      console.log("Room summary:", roomSummary); // Optional: Update UI with room counts
    });

    return () => {
      socket.off();
    };
  }, []);

  const joinRoom = (newRoom) => {
    socket.emit("joinRoom", newRoom);
  };

  const createRoom = (roomName) => {
    socket.emit("createRoom", roomName);
  };

  const sendMessage = (room, message) => {
    socket.emit("sendMessage", { room, message, sender: "You" });
  };

  return {
    rooms,
    room,
    messages,
    userCount,
    joinRoom,
    createRoom,
    sendMessage,
  };
};

export default useChat;
