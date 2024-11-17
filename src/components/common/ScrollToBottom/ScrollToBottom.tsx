import { FC } from 'react';
import './ScrollToBottom.scss';

interface ScrollToBottomProps {
  onClick: () => void;
}

const ScrollToBottom: FC<ScrollToBottomProps> = ({ onClick }) => {
  return (
    <button className="scroll-to-bottom" onClick={onClick} title="Scroll to bottom">
      <span>↓</span>
    </button>
  );
};

export default ScrollToBottom; 