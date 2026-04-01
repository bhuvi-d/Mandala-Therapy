import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme, themeConfigs } from '../ThemeContext';

/* SVG flower components — each nav item gets a unique petal shape */
const FlowerIcon = ({ petals = 6, innerRadius = 3, outerRadius = 9, color = 'currentColor' }) => {
  const paths = [];
  for (let i = 0; i < petals; i++) {
    const angle = (360 / petals) * i;
    const rad = (angle * Math.PI) / 180;
    const cx = 12 + Math.cos(rad) * (outerRadius * 0.45);
    const cy = 12 + Math.sin(rad) * (outerRadius * 0.45);
    paths.push(
      <ellipse
        key={i}
        cx={cx}
        cy={cy}
        rx={outerRadius * 0.28}
        ry={outerRadius * 0.55}
        transform={`rotate(${angle + 90}, ${cx}, ${cy})`}
        fill={color}
        opacity="0.75"
      />
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none">
      {paths}
      <circle cx="12" cy="12" r={innerRadius} fill={color} opacity="0.9" />
    </svg>
  );
};

const navLinks = [
  { id: 'hero', label: 'Home', petals: 5, outerR: 10, path: '/' },
  { id: 'session', label: 'Sessions', petals: 12, outerR: 12, path: '/session' },
  { id: 'community', label: 'Community', petals: 7, outerR: 11, path: '/community' },
  { id: 'breathe', label: 'Breathe', petals: 8, outerR: 9, path: '/' },
  { id: 'mandala-of-day', label: 'Daily', petals: 6, outerR: 10, path: '/' },
  { id: 'gallery', label: 'Gallery', petals: 7, outerR: 9, path: '/' },
  { id: 'journal', label: 'Journal', petals: 4, outerR: 11, path: '/' },
  { id: 'music', label: 'Music', petals: 10, outerR: 8, path: '/' },
];

const Navbar = () => {
  const { theme, themeName, isDark, toggleDark, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themePickerOpen, setThemePickerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (link) => {
    setMobileOpen(false);
    
    if (link.id === 'session' || link.id === 'community') {
        navigate(link.path);
        return;
    }

    if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation then scroll
        setTimeout(() => scrollToLocal(link.id), 100);
    } else {
        scrollToLocal(link.id);
    }
  };

  const scrollToLocal = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-strong shadow-lg py-2'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => handleNavClick({id: 'hero'})}
              className="flex items-center gap-2 group"
            >
              <svg width="32" height="32" viewBox="0 0 48 48" className={`${theme.svgColor} animate-spin-slow`}>
                <g fill="currentColor">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <ellipse
                      key={i}
                      cx="24"
                      cy="24"
                      rx="4"
                      ry="12"
                      transform={`rotate(${angle}, 24, 24)`}
                      opacity="0.7"
                    />
                  ))}
                  <circle cx="24" cy="24" r="5" opacity="0.9" />
                </g>
              </svg>
              <span className={`font-display text-xl font-bold ${theme.text} hidden sm:block group-hover:opacity-80 transition-opacity tracking-wide`}>
                Mandala Therapy
              </span>
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/20 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 flex items-center gap-1.5 group`}
                >
                  <span className={`nav-flower ${theme.svgColor}`}>
                    <FlowerIcon petals={link.petals} outerRadius={link.outerR} />
                  </span>
                  <span className="font-body tracking-wide">{link.label}</span>
                </button>
              ))}
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2">
              {/* Theme Picker */}
              <div className="relative">
                <button
                  onClick={() => setThemePickerOpen(!themePickerOpen)}
                  className="p-2 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 transition-all text-lg"
                  aria-label="Change theme"
                  title="Change mood theme"
                >
                  🎨
                </button>
                {themePickerOpen && (
                  <div className="absolute right-0 top-12 glass-strong rounded-2xl p-3 shadow-xl min-w-[200px] animate-fade-in-down">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 px-2 font-body">
                      Mood Theme
                    </p>
                    {Object.entries(themeConfigs).map(([key, cfg]) => (
                      <button
                        key={key}
                        onClick={() => { setTheme(key); setThemePickerOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                          themeName === key
                            ? 'bg-gray-200/50 dark:bg-white/10 font-semibold'
                            : 'hover:bg-gray-100/50 dark:hover:bg-white/5'
                        } text-gray-700 dark:text-gray-200 font-body`}
                      >
                        <span className="text-lg">{cfg.emoji}</span>
                        <span>{cfg.name}</span>
                        {themeName === key && <span className="ml-auto text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDark}
                className="p-2 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 transition-all text-lg"
                aria-label="Toggle dark mode"
              >
                {isDark ? '🌙' : '☀️'}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 transition-all"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden glass-strong mt-2 mx-4 rounded-2xl p-4 shadow-xl animate-fade-in-down">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all hover:bg-white/20 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 font-body"
                >
                  <span className={`nav-flower ${theme.svgColor}`}>
                    <FlowerIcon petals={link.petals} outerRadius={link.outerR} />
                  </span>
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Click outside to close dropdowns */}
      {(themePickerOpen || mobileOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setThemePickerOpen(false); setMobileOpen(false); }}
        />
      )}
    </>
  );
};

export default Navbar;
