import React, { useMemo } from 'react';
import { useTheme } from '../ThemeContext';

/*
 * Full-page floating elements — a mix of tiny particles AND large glowing orbs.
 * The large orbs recreate the hero's dreamy, colorful vibe across the entire page.
 */
const ParticleBackground = () => {
  const { theme } = useTheme();

  // Small floating particles (existing)
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: `p-${i}`,
      size: Math.random() * 8 + 3,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.25 + 0.08,
      isAlt: i % 3 === 0,
    }));
  }, []);

  // Large glowing orbs — these create the colorful vibe from the hero
  const orbs = useMemo(() => [
    // Top area (below hero)
    { id: 'o1', size: 350, left: '10%', top: '15%', opacity: 0.12, dur: 20, delay: 0, alt: false },
    { id: 'o2', size: 280, left: '75%', top: '12%', opacity: 0.1, dur: 25, delay: 3, alt: true },
    // Quote / Welcome area
    { id: 'o3', size: 300, left: '60%', top: '22%', opacity: 0.08, dur: 22, delay: 5, alt: false },
    // Breathe section
    { id: 'o4', size: 400, left: '20%', top: '30%', opacity: 0.1, dur: 28, delay: 2, alt: true },
    { id: 'o5', size: 250, left: '80%', top: '35%', opacity: 0.07, dur: 18, delay: 7, alt: false },
    // Mandala of the Day
    { id: 'o6', size: 320, left: '5%', top: '42%', opacity: 0.09, dur: 24, delay: 4, alt: true },
    // Gallery area
    { id: 'o7', size: 380, left: '70%', top: '50%', opacity: 0.1, dur: 26, delay: 1, alt: false },
    { id: 'o8', size: 260, left: '30%', top: '55%', opacity: 0.08, dur: 20, delay: 6, alt: true },
    // Journal section
    { id: 'o9', size: 300, left: '85%', top: '65%', opacity: 0.09, dur: 22, delay: 3, alt: false },
    { id: 'o10', size: 350, left: '15%', top: '70%', opacity: 0.1, dur: 30, delay: 8, alt: true },
    // Music section
    { id: 'o11', size: 280, left: '50%', top: '78%', opacity: 0.08, dur: 19, delay: 2, alt: false },
    { id: 'o12', size: 320, left: '90%', top: '82%', opacity: 0.07, dur: 25, delay: 5, alt: true },
    // Footer area
    { id: 'o13', size: 400, left: '25%', top: '90%', opacity: 0.1, dur: 27, delay: 1, alt: false },
    { id: 'o14', size: 250, left: '65%', top: '93%', opacity: 0.08, dur: 21, delay: 4, alt: true },
  ], []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Large glowing orbs */}
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className={`absolute rounded-full ${orb.alt ? theme.particleAlt : theme.particle} blur-3xl`}
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            left: orb.left,
            top: orb.top,
            opacity: orb.opacity,
            animation: `float ${orb.dur}s ease-in-out ${orb.delay}s infinite`,
          }}
        />
      ))}

      {/* Small particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full ${p.isAlt ? theme.particleAlt : theme.particle} blur-sm`}
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: p.opacity,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
