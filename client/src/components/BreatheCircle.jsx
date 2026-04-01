import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useTheme } from '../ThemeContext';
import SectionBackground from './SectionBackground';

const PatternFlower = ({ className = '', spin = 'animate-spin-slow', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="currentColor" className={`${className} ${spin}`}>
    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
      <ellipse
        key={i}
        cx="50"
        cy="50"
        rx="8"
        ry="25"
        transform={`rotate(${angle}, 50, 50) translate(0, -15)`}
        opacity="0.6"
      />
    ))}
    <circle cx="50" cy="50" r="10" opacity="0.8" />
  </svg>
);

const breathingPatterns = [
  { name: 'Simple', inhale: 4, hold: 0, exhale: 4, holdOut: 0, spin: 'animate-spin-slow' },
  { name: '4-7-8', inhale: 4, hold: 7, exhale: 8, holdOut: 0, spin: 'animate-spin-reverse' },
  { name: 'Box', inhale: 4, hold: 4, exhale: 4, holdOut: 4, spin: 'animate-pulse-soft' },
];

const BreatheCircle = () => {
  const { theme } = useTheme();
  const [patternIndex, setPatternIndex] = useState(0);
  const [phase, setPhase] = useState('INHALE');
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [scale, setScale] = useState(1);
  const intervalRef = useRef(null);
  const pattern = breathingPatterns[patternIndex];

  const getTotalCycleTime = useCallback(() => {
    return pattern.inhale + pattern.hold + pattern.exhale + pattern.holdOut;
  }, [pattern]);

  useEffect(() => {
    if (!isActive) return;

    let elapsed = 0;
    const tick = () => {
      elapsed += 0.05;
      const total = getTotalCycleTime();
      const cycleTime = elapsed % total;

      let currentPhase, currentTimer, currentScale;

      if (cycleTime < pattern.inhale) {
        currentPhase = 'INHALE';
        currentTimer = Math.ceil(pattern.inhale - cycleTime);
        currentScale = 1 + (cycleTime / pattern.inhale) * 0.4;
      } else if (cycleTime < pattern.inhale + pattern.hold) {
        currentPhase = 'HOLD';
        currentTimer = Math.ceil(pattern.hold - (cycleTime - pattern.inhale));
        currentScale = 1.4;
      } else if (cycleTime < pattern.inhale + pattern.hold + pattern.exhale) {
        currentPhase = 'EXHALE';
        const exhaleElapsed = cycleTime - pattern.inhale - pattern.hold;
        currentTimer = Math.ceil(pattern.exhale - exhaleElapsed);
        currentScale = 1.4 - (exhaleElapsed / pattern.exhale) * 0.4;
      } else {
        currentPhase = 'REST';
        currentTimer = Math.ceil(pattern.holdOut - (cycleTime - pattern.inhale - pattern.hold - pattern.exhale));
        currentScale = 1;
      }

      setPhase(currentPhase);
      setTimer(currentTimer);
      setScale(currentScale);
    };

    intervalRef.current = setInterval(tick, 50);
    return () => clearInterval(intervalRef.current);
  }, [isActive, pattern, getTotalCycleTime]);

  const getPhaseLabel = () => {
    switch (phase) {
      case 'INHALE': return 'Breathe In';
      case 'HOLD': return 'Hold';
      case 'EXHALE': return 'Breathe Out';
      case 'REST': return 'Rest';
      default: return '';
    }
  };

  return (
    <section id="breathe" className="py-24 px-4 relative overflow-hidden">
      {/* Decorative Lotus Background */}
      <div className={`${theme.svgColor} opacity-40`}>
        <SectionBackground pattern="lotus" position="center" size={800} spin="slower" />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* LEFT: Text & Patterns */}
            <div className="flex-1 text-center lg:text-left">
                <h2 className={`section-title text-5xl md:text-7xl ${theme.text} mb-6`}>
                    Deep Breath
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-xl font-body mb-12 max-w-lg mx-auto lg:mx-0">
                    Slowing down your breath is the fastest way to calm your nervous system. Choose a pattern and follow the rhythm.
                </p>

                <div className="flex flex-col gap-4 max-w-sm mx-auto lg:mx-0">
                    {breathingPatterns.map((p, i) => (
                        <button
                            key={p.name}
                            onClick={() => setPatternIndex(i)}
                            className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 group ${
                                i === patternIndex
                                ? `${theme.bg} shadow-2xl scale-105 text-white`
                                : 'glass-card border border-transparent hover:border-white/20'
                            }`}
                        >
                            <PatternFlower 
                                className={i === patternIndex ? 'text-white' : theme.svgColor} 
                                spin={p.spin} 
                                size={40} 
                            />
                            <div className="text-left">
                                <p className="font-bold font-body">{p.name} Rhythm</p>
                                <p className={`text-xs uppercase tracking-widest ${i === patternIndex ? 'text-white/80' : 'text-gray-400'}`}>
                                    {p.inhale}s In • {p.hold > 0 ? `${p.hold}s Hold • ` : ''}{p.exhale}s Out
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-12 flex justify-center lg:justify-start">
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={`btn-premium flex items-center gap-3 ${isActive ? theme.btnSecondary : theme.btnPrimary} px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl transition-transform active:scale-95`}
                    >
                        {isActive ? '⏸ Pause Rhythm' : '▶ Resume Rhythm'}
                    </button>
                </div>
            </div>

            {/* RIGHT: The Circle */}
            <div className="flex-1 flex justify-center py-12">
                <div className="relative w-72 h-72 md:w-[450px] md:h-[450px]">
                    {/* Pulsing light rings */}
                    <div
                        className={`absolute inset-0 rounded-full ${theme.particle} opacity-20 blur-3xl`}
                        style={{ transform: `scale(${scale * 1.3})`, transition: 'transform 0.1s linear' }}
                    />
                    <div
                        className={`absolute inset-4 rounded-full ${theme.particleAlt} opacity-15 blur-2xl`}
                        style={{ transform: `scale(${scale * 1.15})`, transition: 'transform 0.1s linear' }}
                    />

                    {/* Ring 3 - outer decorative */}
                    <div
                        className={`absolute inset-4 rounded-full border-2 ${theme.border} opacity-20`}
                        style={{ transform: `scale(${scale})`, transition: 'transform 0.1s linear' }}
                    />

                    {/* Main breathing body */}
                    <div
                        className={`absolute inset-12 rounded-full ${theme.bg} opacity-10 shadow-2xl backdrop-blur-md border border-white/20`}
                        style={{
                            transform: `scale(${scale})`,
                            transition: 'transform 0.1s linear',
                            boxShadow: `0 0 100px rgba(var(--theme-rgb), ${0.1 + scale * 0.15})`,
                        }}
                    />

                    {/* Inner content sphere */}
                    <div
                        className="absolute inset-[25%] rounded-full glass-card shadow-2xl flex flex-col items-center justify-center border border-white/30"
                        style={{ transform: `scale(${scale * 0.85})`, transition: 'transform 0.1s linear' }}
                    >
                        <span className={`text-6xl md:text-8xl font-bold ${theme.text} mb-2 drop-shadow-lg`}>
                            {timer}
                        </span>
                        <span className={`text-base md:text-lg font-medium ${theme.textLight} uppercase tracking-[0.3em] opacity-80`}>
                            {getPhaseLabel()}
                        </span>
                    </div>

                    {/* Orbiting particles around the circle */}
                    {Array.from({ length: 12 }).map((_, i) => (
                         <div
                            key={i}
                            className={`absolute w-3 h-3 rounded-full ${theme.particle} opacity-40`}
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: `rotate(${i * 30}deg) translate(${scale * 200}px) rotate(-${i * 30}deg)`,
                                transition: 'transform 0.1s linear'
                            }}
                        />
                    ))}
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default BreatheCircle;
