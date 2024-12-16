import React from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatArea from "./components/ChatArea/ChatArea";
import Header from "./components/Header/Header";
import useSocket from "./hooks/useSocket";
import useRoomManagement from "./hooks/useRoomManagement";
import useMessages from "./hooks/useMessages";
import styles from "./App.module.css";
import useFetchUUID from "./hooks/useFetchUUID";

const App = () => {
  useSocket(); // Initializes and manages global socket connection
  const { uuid, error, loading } = useFetchUUID();
  const { rooms, currentRoom, userCounts, joinRoom, createRoom } =
    useRoomManagement();
  const { messages, sendMessage } = useMessages(currentRoom);

  console.log(import.meta.env.VITE_BACK_END);

  return (
    <div className={styles.AppContainer}>
      <div className={styles.App}>
        <Sidebar
          rooms={rooms}
          currentRoom={currentRoom}
          onJoinRoom={joinRoom}
          onCreateRoom={createRoom}
        />
        <div className={styles.ChatContainer}>
          <Header room={currentRoom} userCount={userCounts[currentRoom] || 0} />
          <ChatArea
            clientUUID={uuid}
            messages={messages}
            onSendMessage={(message) => sendMessage(message, uuid)}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
