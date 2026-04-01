import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import SectionBackground from './SectionBackground';

/* Animated tea cup with steam */
const TeaCup = () => (
  <span className="inline-block relative" style={{ width: '22px', height: '20px' }}>
    {/* Steam wisps */}
    <svg
      className="absolute -top-4 left-1/2 -translate-x-1/2"
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
    >
      <path
        d="M6 14 Q6 10 8 8 Q10 6 8 2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.4"
        className="animate-steam-1"
      />
      <path
        d="M10 14 Q10 10 12 8 Q14 6 12 2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.3"
        className="animate-steam-2"
      />
      <path
        d="M14 14 Q14 11 12 9 Q10 7 12 4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.25"
        className="animate-steam-3"
      />
    </svg>

    {/* Cup body */}
    <svg
      width="22"
      height="20"
      viewBox="0 0 22 20"
      fill="currentColor"
      className="relative z-10"
    >
      {/* Cup shape */}
      <path
        d="M2 4 L2 14 Q2 18 6 18 L12 18 Q16 18 16 14 L16 4 Z"
        opacity="0.7"
      />
      {/* Handle */}
      <path
        d="M16 6 Q20 6 20 10 Q20 14 16 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* Tea surface */}
      <ellipse cx="9" cy="5" rx="7" ry="1.5" opacity="0.4" />
      {/* Saucer */}
      <ellipse cx="9" cy="18.5" rx="10" ry="1.5" opacity="0.3" />
    </svg>
  </span>
);

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="relative overflow-hidden mt-20">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className={`w-full h-16 ${theme.svgColor}`} fill="currentColor">
          <path d="M0,60 C200,100 400,0 600,50 C800,100 1000,20 1200,60 L1200,0 L0,0 Z" opacity="0.05" />
        </svg>
      </div>

      <div className={`${theme.svgColor} opacity-15`}>
        <SectionBackground pattern="spiral" position="center" size={500} spin="slower" />
      </div>

      <div className="glass-strong pt-16 pb-8 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Mandala Icon */}
          <div className="mb-6">
            <svg width="48" height="48" viewBox="0 0 48 48" className={`mx-auto ${theme.svgColor} animate-spin-slow`}>
              <g fill="currentColor">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <ellipse
                    key={i}
                    cx="24"
                    cy="24"
                    rx="4"
                    ry="12"
                    transform={`rotate(${angle}, 24, 24)`}
                    opacity="0.5"
                  />
                ))}
                <circle cx="24" cy="24" r="5" opacity="0.7" />
              </g>
            </svg>
          </div>

          {/* Quote */}
          <p className={`font-display text-xl italic ${theme.text} mb-2`}>
            "Happiness is everything"
          </p>
          <p className={`font-script text-lg ${theme.textLight} mb-8`}>
            — Bhuvi
          </p>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <a
              href="https://github.com/bhuvi-d/mandala-therapy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium flex items-center gap-1.5 font-body"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>

          {/* Divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mx-auto mb-6" />

          {/* Copyright */}
          <p className="text-sm text-gray-400 dark:text-gray-500 font-body flex items-center justify-center gap-2">
            &copy; {new Date().getFullYear()} Mandala Therapy by
            <Link to="/admin" className="relative inline-block group ml-1">
                <span className={`font-script text-xl ${theme.text} transition-all duration-500 group-hover:scale-110 group-hover:rotate-2 inline-block`}>
                    Bhuvi
                </span>
                <span className="absolute -top-1 -right-2 text-pink-400 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse text-[10px]">
                    ♥
                </span>
            </Link>
          </p>

          {/* Made with love, art, and tea */}
          <p className={`text-sm mt-3 font-body ${theme.textMuted} flex items-center justify-center gap-1.5`}>
            Made with
            <span className="text-red-400 animate-pulse text-base">&hearts;</span>
            love, art & 
            <span className={`${theme.text} tea-cup-hover`}>
              <TeaCup />
            </span>
            <span className="font-display italic">tea</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
