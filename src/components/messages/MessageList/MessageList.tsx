import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from '../../../features/messages/messagesSlice';
import { RootState, AppDispatch } from '../../../store';
import Message from '../Message/Message';
import ScrollToBottom from '../../common/ScrollToBottom/ScrollToBottom';
import './MessageList.scss';

const MessageList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { messages, loading, page, totalPages } = useSelector((state: RootState) => state.messages);
    const listRef = useRef<HTMLDivElement>(null);
    const [isFetching, setIsFetching] = useState(false);
    const prevScrollHeightRef = useRef<number>(0);
    const lastMessageRef = useRef<number>(0);

    useEffect(() => {
      dispatch(fetchMessages(1));
    }, [dispatch]);

    const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop } = e.currentTarget;

      // Load more when scrolling to top
      if (scrollTop === 0 && !loading && !isFetching && page < totalPages) {
        setIsFetching(true);
        prevScrollHeightRef.current = listRef.current?.scrollHeight || 0;
        
        try {
          await dispatch(fetchMessages(page + 1));
        } finally {
          setIsFetching(false);
          
          // Maintain scroll position after loading new messages
          if (listRef.current) {
            const newScrollHeight = listRef.current.scrollHeight;
            const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
            listRef.current.scrollTop = scrollDiff;
          }
        }
      }
    };

    const scrollToBottom = () => {
      if (listRef.current) {
        listRef.current.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    };

    // Scroll to bottom only for new messages sent by the user
    useEffect(() => {
      if (messages.length > lastMessageRef.current) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.isOutgoing) {
          scrollToBottom();
        }
        lastMessageRef.current = messages.length;
      }
    }, [messages]);

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
        <ScrollToBottom onClick={scrollToBottom} />
      </div>
    );
};

export default MessageList;