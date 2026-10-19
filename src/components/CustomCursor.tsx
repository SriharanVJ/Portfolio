import React, { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div
        className="fixed pointer-events-none z-[10000] hidden md:block"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Main cursor */}
        <div
          className={`w-8 h-8 rounded-full border-2 border-purple-500 transition-all duration-200 ${
            hovered ? 'scale-150 bg-purple-500/20' : 'scale-100'
          } ${clicked ? 'scale-90' : ''}`}
        />

        {/* Inner dot */}
        <div
          className={`absolute top-1/2 left-1/2 w-1 h-1 bg-purple-400 rounded-full transition-all duration-200 ${
            hovered ? 'scale-0' : 'scale-100'
          }`}
          style={{ transform: 'translate(-50%, -50%)' }}
        />

        {/* Trailing effect */}
        <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-ping" />
      </div>

      {/* Cursor trail */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="fixed pointer-events-none z-[9999] hidden md:block w-2 h-2 bg-purple-500/20 rounded-full"
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -50%)',
            transition: `all ${0.1 + i * 0.05}s ease-out`,
            opacity: 1 - i * 0.2,
            width: 8 - i * 1.5,
            height: 8 - i * 1.5,
          }}
        />
      ))}
    </>
  );
};
