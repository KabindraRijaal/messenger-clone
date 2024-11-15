import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from '../../../features/messages/messagesSlice';
import { RootState } from '../../../store';
import Message from '../Message/Message';
import './MessageList.scss';

const MessageList = () => {
    const dispatch = useDispatch();
    const { messages, loading, page, totalPages } = useSelector((state: RootState) => state.messages);
    const listRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      dispatch(fetchMessages(1));
    }, [dispatch]);

    // Scroll to bottom when new message is added
    useEffect(() => {
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.isOutgoing) {
          listRef.current?.scrollTo({
            top: listRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }
    }, [messages]);
  
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop } = e.currentTarget;
      
      // Load more when scrolling to top
      if (scrollTop === 0 && !loading && page < totalPages) {
        dispatch(fetchMessages(page + 1));
      }
    };
  
    return (
      <div className="messages-container">
        <div 
          ref={listRef}
          className="messages-list" 
          onScroll={handleScroll}
        >
          {loading && <div className="loading">Loading...</div>}
          {messages.map((message) => (
            <Message
              key={`${message.id}-${message.timestamp}`}
              content={message.content}
              isOutgoing={message.isOutgoing}
              timestamp={message.timestamp}
            />
          ))}
        </div>
      </div>
    );
};

export default MessageList;