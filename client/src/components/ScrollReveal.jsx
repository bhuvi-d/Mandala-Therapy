import React, { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({ children, className = '', variant = 'up', delay = 0 }) => {
  const ref = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const variantClass = {
    up: 'reveal',
    left: 'reveal-left',
    scale: 'reveal-scale',
  }[variant] || 'reveal';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsRevealed(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${variantClass} ${isRevealed ? 'revealed' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
