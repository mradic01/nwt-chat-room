import { useState, useEffect } from "react";
import socket from "../socket/socket";

const useRoomManagement = () => {
  const [rooms, setRooms] = useState(["Global"]);
  const [currentRoom, setCurrentRoom] = useState("Global");
  const [userCounts, setUserCounts] = useState({ Global: 0 });

  useEffect(() => {
    socket.on("roomCreated", (newRoom) => {
      setRooms((prev) => [...prev, newRoom]);
    });

    socket.on("roomSummary", (roomCounts) => {
      // console.log(roomCounts);
      setRooms(Object.keys(roomCounts));
      setUserCounts(roomCounts);
    });

    return () => {
      socket.off("roomCreated");
      socket.off("roomSummary");
    };
  }, []);

  const joinRoom = (roomName) => {
    socket.emit("joinRoom", roomName);
    setCurrentRoom(roomName);
  };

  const createRoom = (roomName) => {
    socket.emit("createRoom", roomName);
  };

  return { rooms, currentRoom, userCounts, joinRoom, createRoom };
};

export default useRoomManagement;
