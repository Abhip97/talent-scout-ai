import { useState, useEffect, useRef } from 'react';

export const AnimatedCounter = ({ value, duration = 1200, className = '' }) => {
  const [current, setCurrent] = useState(0);
  const startRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const startValue = current;
    const endValue = Number(value) || 0;
    if (startValue === endValue) return;

    startRef.current = null;

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(startValue + (endValue - startValue) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [value, duration]);

  return <span className={className}>{current}</span>;
};

export default AnimatedCounter;
