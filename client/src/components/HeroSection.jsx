import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

const MandalaSVG = ({ className }) => {
  const layers = [
    { count: 16, radius: 155, rx: 12, ry: 30, opacity: 0.15 },
    { count: 12, radius: 120, rx: 10, ry: 28, opacity: 0.2 },
    { count: 8, radius: 85, rx: 9, ry: 24, opacity: 0.25 },
    { count: 6, radius: 55, rx: 7, ry: 18, opacity: 0.3 },
  ];

  return (
    <svg viewBox="0 0 400 400" className={className} fill="currentColor">
      {layers.map((layer, li) =>
        Array.from({ length: layer.count }).map((_, i) => {
          const angle = (360 / layer.count) * i;
          const rad = (angle * Math.PI) / 180;
          const cx = 200 + Math.cos(rad) * layer.radius;
          const cy = 200 + Math.sin(rad) * layer.radius;
          return (
            <ellipse
              key={`${li}-${i}`}
              cx={cx}
              cy={cy}
              rx={layer.rx}
              ry={layer.ry}
              transform={`rotate(${angle + 90}, ${cx}, ${cy})`}
              opacity={layer.opacity}
            />
          );
        })
      )}
      {/* Decorative circles */}
      <circle cx="200" cy="200" r="35" opacity="0.15" />
      <circle cx="200" cy="200" r="25" opacity="0.2" />
      <circle cx="200" cy="200" r="12" opacity="0.3" />
      {/* Outer decorative ring */}
      <circle cx="200" cy="200" r="185" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      <circle cx="200" cy="200" r="175" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
    </svg>
  );
};

const HeroSection = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showSubtext, setShowSubtext] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSubtext(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="hero"
      className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br ${theme.heroGradient}`}
    >
      {/* Background Mandala SVGs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <MandalaSVG className={`w-[800px] h-[800px] ${theme.svgColor} animate-spin-slower opacity-40`} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <MandalaSVG className={`w-[500px] h-[500px] ${theme.svgColor} animate-spin-reverse opacity-30`} />
      </div>

      {/* Decorative blurred orbs */}
      <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full ${theme.particle} opacity-20 blur-3xl animate-float`} />
      <div className={`absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full ${theme.particleAlt} opacity-20 blur-3xl animate-float-delayed`} />
      <div className={`absolute top-1/2 right-1/3 w-32 h-32 rounded-full ${theme.particle} opacity-15 blur-2xl animate-float-slow`} />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Small greeting */}
        <p className={`font-script text-2xl md:text-3xl ${theme.textLight} mb-4 animate-fade-in`}>
          Welcome to
        </p>

        {/* Main title */}
        <h1 className="section-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 animate-fade-in-up">
          <span className="gradient-text">Mandala Therapy</span>
        </h1>

        {/* Subtitle - Typewriter effect */}
        <div className={`transition-all duration-1000 ${showSubtext ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-body max-w-2xl mx-auto leading-relaxed mb-2">
            A calming space for your mind. Create, colour, breathe, and find your inner peace through the art of mandalas.
          </p>
          <p className="flex items-center justify-center gap-2 mt-4">
             <span className={`text-sm md:text-base text-gray-500 dark:text-gray-400 font-body`}>crafted with love by</span>
             <span className="relative inline-block group cursor-default">
                <span className={`font-script text-xl md:text-2xl ${theme.text} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 inline-block drop-shadow-[0_0_15px_rgba(236,72,153,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]`}>
                    Bhuvi
                </span>
                <span className={`absolute -bottom-0.5 left-0 right-0 h-px ${theme.bg} opacity-30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center`} />
                <span className="absolute -top-1.5 -right-2 text-pink-400 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse text-[10px]">
                    ♥
                </span>
             </span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-wrap gap-4 justify-center mt-12 transition-all duration-1000 delay-500 ${showSubtext ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={() => navigate('/session')}
            className={`btn-premium btn-glow-hover ${theme.btnPrimary} px-10 py-5 rounded-2xl text-xl font-bold shadow-lg ${theme.glow} shadow-2xl transform hover:scale-105 active:scale-95 transition-all`}
          >
            Join Mandala Session ✨
          </button>
          
          <button
            onClick={() => scrollTo('breathe')}
            className={`btn-premium glass-card px-10 py-5 rounded-2xl text-xl text-gray-700 dark:text-gray-200 border border-white/10 hover:bg-white/20 dark:hover:bg-white/5 transition-all`}
          >
            Begin Journey ✨
          </button>

          <button
            onClick={() => scrollTo('gallery')}
            className={`btn-premium hidden md:block glass px-8 py-4 rounded-2xl text-base text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-all`}
          >
            Explore Gallery
          </button>
        </div>

        {/* Scroll indicator */}
        <div className={`mt-16 transition-all duration-1000 delay-700 ${showSubtext ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => scrollTo('breathe')}
            className="animate-wave inline-block text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-xs font-medium tracking-wider uppercase mt-1 block">Scroll Down</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
