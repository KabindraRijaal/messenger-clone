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

    useEffect(() => {
        const messagesList = listRef.current;
        if (!messagesList) return;

        const updateGradients = () => {
            const visibleMessages = Array.from(messagesList.querySelectorAll('.message.outgoing'))
                .filter(element => {
                    const rect = element.getBoundingClientRect();
                    const containerRect = messagesList.getBoundingClientRect();
                    return rect.top >= containerRect.top && rect.bottom <= containerRect.bottom;
                });

            if (visibleMessages.length === 0) return;

            const totalVisible = visibleMessages.length;
            
            visibleMessages.forEach((msg, index) => {
                const progress = index / (totalVisible - 1);
                
                // Purple to Blue gradient values (adjusted for better visibility)
                const startColor = { r: 160, g: 51, b: 255 };   // #A033FF (Purple)
                const midColor = { r: 14, g: 142, b: 255 };     // #0E8EFF (Mid Blue)
                const endColor = { r: 0, g: 176, b: 255 };      // #00B0FF (Light Blue)
                
                let r, g, b;
                
                if (progress < 0.5) {
                    // First half: Purple to Mid Blue
                    const p = progress * 2;
                    r = Math.round(startColor.r + (midColor.r - startColor.r) * p);
                    g = Math.round(startColor.g + (midColor.g - startColor.g) * p);
                    b = Math.round(startColor.b + (midColor.b - startColor.b) * p);
                } else {
                    // Second half: Mid Blue to Light Blue
                    const p = (progress - 0.5) * 2;
                    r = Math.round(midColor.r + (endColor.r - midColor.r) * p);
                    g = Math.round(midColor.g + (endColor.g - midColor.g) * p);
                    b = Math.round(midColor.b + (endColor.b - midColor.b) * p);
                }
                
                (msg as HTMLElement).style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            });

            // Reset color for non-visible messages
            const allOutgoingMessages = messagesList.querySelectorAll('.message.outgoing');
            allOutgoingMessages.forEach(msg => {
                if (!visibleMessages.includes(msg)) {
                    (msg as HTMLElement).style.backgroundColor = '';
                }
            });
        };

        // Update on scroll
        const handleScroll = () => {
            requestAnimationFrame(updateGradients);
        };

        messagesList.addEventListener('scroll', handleScroll);
        
        // Initial update and update on changes
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some(entry => entry.isIntersecting)) {
                    requestAnimationFrame(updateGradients);
                }
            },
            {
                root: messagesList,
                threshold: [0, 0.5, 1]
            }
        );

        const messages = messagesList.querySelectorAll('.message.outgoing');
        messages.forEach(msg => observer.observe(msg));

        // Initial update
        updateGradients();

        return () => {
            observer.disconnect();
            messagesList.removeEventListener('scroll', handleScroll);
        };
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