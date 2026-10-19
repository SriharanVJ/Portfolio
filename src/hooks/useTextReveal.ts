import { useEffect, useState, RefObject } from 'react';

export const useTextReveal = (ref: RefObject<HTMLElement>, delay: number = 0) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasRevealed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRevealed) {
          setTimeout(() => {
            setIsVisible(true);
            setHasRevealed(true);
          }, delay);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, delay, hasRevealed]);

  return isVisible;
};
