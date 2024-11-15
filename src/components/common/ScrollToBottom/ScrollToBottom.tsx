import { FC } from 'react';
import './ScrollToBottom.scss';

interface ScrollToBottomProps {
  onClick: () => void;
}

const ScrollToBottom: FC<ScrollToBottomProps> = ({ onClick }) => {
  return (
    <button className="scroll-to-bottom" onClick={onClick}>
      ↓
    </button>
  );
};

export default ScrollToBottom; 