import { useEffect, useState, useRef } from 'react';

export const useCounter = (
  end: number,
  duration: number = 2000,
  start: number = 0
) => {
  const [count, setCount] = useState(start);
  const [isCounting, setIsCounting] = useState(false);
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (!isCounting) return;

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const progress = currentTime - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      const currentCount = Math.floor(start + (end - start) * easeOutQuart);

      setCount(currentCount);

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
        setIsCounting(false);
      }
    };

    requestAnimationFrame(animate);
  }, [isCounting, end, duration, start]);

  const startCounting = () => {
    startTimeRef.current = undefined;
    setIsCounting(true);
  };

  return { count, startCounting };
};
