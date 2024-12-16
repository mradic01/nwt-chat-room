import React, { useState, useEffect, useRef } from "react";
import styles from "./ChatArea.module.css";

const ChatArea = ({ messages, onSendMessage, clientUUID }) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={styles.ChatArea}>
      <div className={styles.Messages}>
        {messages.map(({ message: msg, sender, timestamp }) => (
          <div
            key={timestamp}
            className={`${styles.Message} ${
              sender === clientUUID ? styles.Sent : styles.Received
            }`}
          >
            {sender !== clientUUID && (
              <p
                style={{
                  fontSize: "0.8rem",
                  fontStyle: "italic",
                  textAlign: "right",
                  color: "var(--placeholder)",
                  marginBottom: "0.2rem",
                }}
              >
                {"~" + sender.slice(-8)}
              </p>
            )}
            <p>{msg}</p>
            <p
              className={`${styles.Timestamp} ${
                sender === clientUUID ? styles.Sent : styles.Received
              }`}
            >
              {new Date(timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.InputArea}>
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatArea;
