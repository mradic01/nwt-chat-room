import { useState, useEffect } from "react";
import socket from "../socket/socket";

const useMessages = (currentRoom) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("loadMessages", (loadedMessages) => {
      setMessages(loadedMessages);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("loadMessages");
    };
  }, []);

  const sendMessage = (message, uuid) => {
    socket.emit("sendMessage", {
      room: currentRoom,
      message,
      sender: uuid,
      timestamp: new Date(),
    });
    setMessages((prev) => [
      ...prev,
      { message, sender: uuid, timestamp: new Date() },
    ]);
  };

  return { messages, sendMessage };
};

export default useMessages;
