import React, { useState } from "react";
import styles from "./Sidebar.module.css";

const Sidebar = ({ rooms, currentRoom, onJoinRoom, onCreateRoom }) => {
  const [newRoom, setNewRoom] = useState("");

  const handleCreateRoom = () => {
    if (newRoom.trim()) {
      onCreateRoom(newRoom);
      setNewRoom("");
    }
  };

  return (
    <div className={styles.Sidebar}>
      <h2>Chat Rooms</h2>
      <div className={styles.NewRoom}>
        <input
          type="text"
          placeholder="New Room"
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
        />
        <button onClick={handleCreateRoom}>+</button>
      </div>
      <div className={styles.RoomsContainer}>
        {rooms.map((room) => (
          <div
            key={room}
            className={`${styles.Room} ${
              room === currentRoom ? styles.Active : ""
            }`}
            onClick={() => onJoinRoom(room)}
          >
            {room}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
