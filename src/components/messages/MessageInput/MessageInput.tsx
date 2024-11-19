import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./MessageInput.scss";
import { addMessage } from "../../../features/messages/messagesSlice";
import MessageList from "../MessageList/MessageList";
import { AppDispatch } from "../../../store";
import Loading from '../../common/Loading/Loading';

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setLoading(true);
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
      setLoading(false);
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
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? <Loading size="small" /> : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
