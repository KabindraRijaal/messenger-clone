import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollProps {
  onLoadMore: () => void;
  loading: boolean;
}

export const useInfiniteScroll = ({ onLoadMore, loading }: UseInfiniteScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (container && !loading) {
      if (container.scrollTop === 0) {
        onLoadMore();
      }
    }
  }, [loading, onLoadMore]);

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      return () => currentRef.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return scrollRef;
}; 