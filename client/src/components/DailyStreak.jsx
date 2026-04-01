import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../ThemeContext';

const DailyStreak = () => {
  const { theme } = useTheme();
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [justIncremented, setJustIncremented] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const saved = JSON.parse(localStorage.getItem('mandala-streak') || '{}');

    if (saved.lastVisit === today) {
      setStreak(saved.count || 1);
      return;
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    let newCount;

    if (saved.lastVisit === yesterday) {
      newCount = (saved.count || 0) + 1;
    } else {
      newCount = 1;
    }

    localStorage.setItem('mandala-streak', JSON.stringify({ lastVisit: today, count: newCount }));
    setStreak(newCount);
    setJustIncremented(true);

    if (newCount > 1 && newCount % 3 === 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, []);

  const confettiPieces = useMemo(() => {
    if (!showConfetti) return [];
    const colors = ['#ec4899', '#8b5cf6', '#06b6d4', '#f97316', '#10b981', '#f472b6', '#a78bfa'];
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      duration: Math.random() * 2 + 2,
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
    }));
  }, [showConfetti]);

  const getStreakMessage = () => {
    if (streak >= 30) return 'Soul Master';
    if (streak >= 14) return 'Luminous Journey';
    if (streak >= 7) return 'Deep Connection';
    if (streak >= 3) return 'Flow State';
    if (streak >= 2) return 'Inner Spark';
    return 'First Step';
  };

  return (
    <>
      <div 
        className={`fixed bottom-8 left-8 z-50 transition-all duration-700 ${justIncremented ? 'animate-bounce-in' : 'animate-fade-in'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative group cursor-default">
            {/* The Growth Mandala Icon */}
            <div className={`relative w-16 h-16 rounded-full glass-strong shadow-2xl flex items-center justify-center border border-white/20 overflow-hidden transition-all duration-500 ${isHovered ? 'w-48 px-6 rounded-2xl' : ''}`}>
                <div className="flex items-center gap-3 w-full justify-center">
                    {/* Flower Petals Icon */}
                    <div className="relative shrink-0 w-10 h-10 flex items-center justify-center">
                        <div className={`absolute inset-0 ${theme.textLight} opacity-20 animate-spin-slower`}>
                            <svg viewBox="0 0 100 100" fill="currentColor">
                                {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
                                    <ellipse key={i} cx="50" cy="50" rx="6" ry="18" transform={`rotate(${a}, 50, 50)`} />
                                ))}
                            </svg>
                        </div>
                        <span className={`relative text-xl font-bold font-display ${theme.text}`}>
                            {streak}
                        </span>
                    </div>

                    {/* Expandable Text Area */}
                    <div className={`overflow-hidden transition-all duration-500 flex flex-col ${isHovered ? 'opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-4'}`}>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 whitespace-nowrap">Consistency</span>
                        <span className={`text-sm font-semibold ${theme.text} whitespace-nowrap`}>{getStreakMessage()}</span>
                    </div>
                </div>
                
                {/* Visual feedback circle background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-0 group-hover:opacity-[0.05] transition-opacity`} />
            </div>
            
            {/* Tooltip hint for first-time use */}
            {!isHovered && streak > 0 && (
                 <div className="absolute -top-10 left-0 bg-white dark:bg-gray-800 text-[10px] px-2 py-1 rounded shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest text-gray-400">
                    Your Streak
                </div>
            )}
        </div>
      </div>

      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        {showConfetti && confettiPieces.map((piece) => (
            <div
            key={piece.id}
            className="absolute top-[-20%] animate-confetti"
            style={{
                left: `${piece.left}%`,
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                backgroundColor: piece.color,
                borderRadius: '50%',
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                transform: `rotate(${piece.rotation}deg)`,
                opacity: 0.8
            }}
            />
        ))}
      </div>
    </>
  );
};

export default DailyStreak;
