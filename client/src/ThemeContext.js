import React, { createContext, useContext, useState, useEffect } from 'react';

export const themeConfigs = {
  rose: {
    name: 'Rose Garden',
    emoji: '🌸',
    text: 'text-pink-700 dark:text-pink-200',
    textLight: 'text-pink-600 dark:text-pink-300',
    textMuted: 'text-pink-500/80 dark:text-pink-400/80',
    bg: 'bg-pink-500',
    bgHover: 'hover:bg-pink-600',
    bgLight: 'bg-pink-50 dark:bg-pink-950/40',
    bgCard: 'bg-white/70 dark:bg-gray-900/60',
    bgSolid: 'bg-rose-50/80 dark:bg-[#0c0814]',
    bgGradient: 'from-pink-50 via-rose-50 to-fuchsia-50 dark:from-gray-950 dark:via-pink-950/40 dark:to-fuchsia-950/30',
    heroGradient: 'from-pink-100 via-rose-200/60 to-fuchsia-100 dark:from-gray-950 dark:via-pink-950/60 dark:to-fuchsia-950/40',
    border: 'border-pink-200 dark:border-pink-800',
    borderAccent: 'border-pink-400 dark:border-pink-600',
    glow: 'shadow-pink-500/20',
    glowStrong: 'shadow-pink-500/40',
    ring: 'ring-pink-400/30',
    btnPrimary: 'bg-pink-500 hover:bg-pink-600 text-white',
    btnSecondary: 'bg-pink-100 hover:bg-pink-200 text-pink-700 dark:bg-pink-900/30 dark:hover:bg-pink-900/50 dark:text-pink-200',
    divider: 'text-pink-300 dark:text-pink-700',
    particle: 'bg-pink-400 dark:bg-pink-500',
    particleAlt: 'bg-fuchsia-400 dark:bg-fuchsia-500',
    svgColor: 'text-pink-400 dark:text-pink-600',
    inputBorder: 'border-pink-300 dark:border-pink-600 focus:border-pink-500 focus:ring-pink-500/30',
    scrollbarThumb: '#ec4899',
  },
  ocean: {
    name: 'Ocean Calm',
    emoji: '🌊',
    text: 'text-cyan-700 dark:text-cyan-200',
    textLight: 'text-cyan-600 dark:text-cyan-300',
    textMuted: 'text-cyan-500/80 dark:text-cyan-400/80',
    bg: 'bg-cyan-500',
    bgHover: 'hover:bg-cyan-600',
    bgLight: 'bg-cyan-50 dark:bg-cyan-950/40',
    bgCard: 'bg-white/70 dark:bg-gray-900/60',
    bgSolid: 'bg-cyan-50/80 dark:bg-[#060e14]',
    bgGradient: 'from-cyan-50 via-sky-50 to-blue-50 dark:from-gray-950 dark:via-cyan-950/40 dark:to-blue-950/30',
    heroGradient: 'from-cyan-100 via-sky-200/60 to-blue-100 dark:from-gray-950 dark:via-cyan-950/60 dark:to-blue-950/40',
    border: 'border-cyan-200 dark:border-cyan-800',
    borderAccent: 'border-cyan-400 dark:border-cyan-600',
    glow: 'shadow-cyan-500/20',
    glowStrong: 'shadow-cyan-500/40',
    ring: 'ring-cyan-400/30',
    btnPrimary: 'bg-cyan-500 hover:bg-cyan-600 text-white',
    btnSecondary: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700 dark:bg-cyan-900/30 dark:hover:bg-cyan-900/50 dark:text-cyan-200',
    divider: 'text-cyan-300 dark:text-cyan-700',
    particle: 'bg-cyan-400 dark:bg-cyan-500',
    particleAlt: 'bg-sky-400 dark:bg-sky-500',
    svgColor: 'text-cyan-400 dark:text-cyan-600',
    inputBorder: 'border-cyan-300 dark:border-cyan-600 focus:border-cyan-500 focus:ring-cyan-500/30',
    scrollbarThumb: '#06b6d4',
  },
  forest: {
    name: 'Forest Peace',
    emoji: '🌿',
    text: 'text-emerald-700 dark:text-emerald-200',
    textLight: 'text-emerald-600 dark:text-emerald-300',
    textMuted: 'text-emerald-500/80 dark:text-emerald-400/80',
    bg: 'bg-emerald-500',
    bgHover: 'hover:bg-emerald-600',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
    bgCard: 'bg-white/70 dark:bg-gray-900/60',
    bgSolid: 'bg-emerald-50/80 dark:bg-[#06140c]',
    bgGradient: 'from-emerald-50 via-green-50 to-teal-50 dark:from-gray-950 dark:via-emerald-950/40 dark:to-teal-950/30',
    heroGradient: 'from-emerald-100 via-green-200/60 to-teal-100 dark:from-gray-950 dark:via-emerald-950/60 dark:to-teal-950/40',
    border: 'border-emerald-200 dark:border-emerald-800',
    borderAccent: 'border-emerald-400 dark:border-emerald-600',
    glow: 'shadow-emerald-500/20',
    glowStrong: 'shadow-emerald-500/40',
    ring: 'ring-emerald-400/30',
    btnPrimary: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    btnSecondary: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-200',
    divider: 'text-emerald-300 dark:text-emerald-700',
    particle: 'bg-emerald-400 dark:bg-emerald-500',
    particleAlt: 'bg-teal-400 dark:bg-teal-500',
    svgColor: 'text-emerald-400 dark:text-emerald-600',
    inputBorder: 'border-emerald-300 dark:border-emerald-600 focus:border-emerald-500 focus:ring-emerald-500/30',
    scrollbarThumb: '#10b981',
  },
  sunset: {
    name: 'Warm Sunset',
    emoji: '🌅',
    text: 'text-orange-700 dark:text-orange-200',
    textLight: 'text-orange-600 dark:text-orange-300',
    textMuted: 'text-orange-500/80 dark:text-orange-400/80',
    bg: 'bg-orange-500',
    bgHover: 'hover:bg-orange-600',
    bgLight: 'bg-orange-50 dark:bg-orange-950/40',
    bgCard: 'bg-white/70 dark:bg-gray-900/60',
    bgSolid: 'bg-orange-50/80 dark:bg-[#140e06]',
    bgGradient: 'from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-950 dark:via-orange-950/40 dark:to-amber-950/30',
    heroGradient: 'from-orange-100 via-amber-200/60 to-yellow-100 dark:from-gray-950 dark:via-orange-950/60 dark:to-amber-950/40',
    border: 'border-orange-200 dark:border-orange-800',
    borderAccent: 'border-orange-400 dark:border-orange-600',
    glow: 'shadow-orange-500/20',
    glowStrong: 'shadow-orange-500/40',
    ring: 'ring-orange-400/30',
    btnPrimary: 'bg-orange-500 hover:bg-orange-600 text-white',
    btnSecondary: 'bg-orange-100 hover:bg-orange-200 text-orange-700 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 dark:text-orange-200',
    divider: 'text-orange-300 dark:text-orange-700',
    particle: 'bg-orange-400 dark:bg-orange-500',
    particleAlt: 'bg-amber-400 dark:bg-amber-500',
    svgColor: 'text-orange-400 dark:text-orange-600',
    inputBorder: 'border-orange-300 dark:border-orange-600 focus:border-orange-500 focus:ring-orange-500/30',
    scrollbarThumb: '#f97316',
  },
  lavender: {
    name: 'Lavender Dreams',
    emoji: '💜',
    text: 'text-violet-700 dark:text-violet-200',
    textLight: 'text-violet-600 dark:text-violet-300',
    textMuted: 'text-violet-500/80 dark:text-violet-400/80',
    bg: 'bg-violet-500',
    bgHover: 'hover:bg-violet-600',
    bgLight: 'bg-violet-50 dark:bg-violet-950/40',
    bgCard: 'bg-white/70 dark:bg-gray-900/60',
    bgSolid: 'bg-violet-50/80 dark:bg-[#0a0614]',
    bgGradient: 'from-violet-50 via-purple-50 to-indigo-50 dark:from-gray-950 dark:via-violet-950/40 dark:to-indigo-950/30',
    heroGradient: 'from-violet-100 via-purple-200/60 to-indigo-100 dark:from-gray-950 dark:via-violet-950/60 dark:to-indigo-950/40',
    border: 'border-violet-200 dark:border-violet-800',
    borderAccent: 'border-violet-400 dark:border-violet-600',
    glow: 'shadow-violet-500/20',
    glowStrong: 'shadow-violet-500/40',
    ring: 'ring-violet-400/30',
    btnPrimary: 'bg-violet-500 hover:bg-violet-600 text-white',
    btnSecondary: 'bg-violet-100 hover:bg-violet-200 text-violet-700 dark:bg-violet-900/30 dark:hover:bg-violet-900/50 dark:text-violet-200',
    divider: 'text-violet-300 dark:text-violet-700',
    particle: 'bg-violet-400 dark:bg-violet-500',
    particleAlt: 'bg-purple-400 dark:bg-purple-500',
    svgColor: 'text-violet-400 dark:text-violet-600',
    inputBorder: 'border-violet-300 dark:border-violet-600 focus:border-violet-500 focus:ring-violet-500/30',
    scrollbarThumb: '#8b5cf6',
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState(() => {
    return localStorage.getItem('mandala-theme') || 'rose';
  });
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('mandala-dark');
    // Default to dark mode if no preference saved
    return stored === null ? true : stored === 'true';
  });

  const theme = themeConfigs[themeName];

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.setAttribute('data-theme', themeName);
    localStorage.setItem('mandala-dark', isDark);
    localStorage.setItem('mandala-theme', themeName);
  }, [isDark, themeName]);

  const toggleDark = () => setIsDark(prev => !prev);
  const setTheme = (name) => {
    if (themeConfigs[name]) setThemeName(name);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, isDark, toggleDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export default ThemeContext;
