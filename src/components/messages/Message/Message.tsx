import { FC } from 'react';
import './Message.scss';

interface MessageProps {
  content: string;
  isOutgoing: boolean;
  timestamp: string;
}

const Message: FC<MessageProps> = ({ content, isOutgoing, timestamp }) => {
  return (
    <div className={`message ${isOutgoing ? 'outgoing' : 'incoming'}`}>
      <div className="message-content">{content}</div>
      <div className="message-timestamp">{timestamp}</div>
    </div>
  );
};

export default Message; 