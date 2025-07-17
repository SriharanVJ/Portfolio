import { useEffect, useState } from "react";

const ScrollProgress = () => {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollTop / scrollHeight) * 100;
      setScrollWidth(scrolled);
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
  <div
    className="fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500 shadow-md z-[9999] transition-all duration-200 ease-out"
    style={{
      width: `${scrollWidth}%`,
      boxShadow: scrollWidth > 0 ? "0 0 10px rgba(255, 105, 180, 0.4)" : "none"
    }}
  ></div>
);

};

export default ScrollProgress;
