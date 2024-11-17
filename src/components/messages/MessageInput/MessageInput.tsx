import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./MessageInput.scss";
import { addMessage } from "../../../features/messages/messagesSlice";
import MessageList from "../MessageList/MessageList";
import { AppDispatch } from "../../../store";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      dispatch(
        addMessage({
          id: Date.now(),
          content: message,
          isOutgoing: true,
          timestamp: new Date().toISOString(),
          email: '',
          status: 'active'
        })
      );
      setMessage("");
    }
  };

  return (
    <div className="message-container">
      <MessageList />
      <form className="message-input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default MessageInput;
