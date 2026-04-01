import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import { useTheme } from './ThemeContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ZenQuote from './components/ZenQuote';
import BreatheCircle from './components/BreatheCircle';
import MandalaOfTheDay from './components/MandalaofTheDay';
import Gallery from './components/Gallery';
import AffirmationJournal from './components/AffirmationJournal';
import MusicPlayer from './components/MusicPlayer';
import Footer from './components/Footer';
import DailyStreak from './components/DailyStreak';
import ParticleBackground from './components/ParticleBackground';
import SectionDivider from './components/SectionDivider';
import ScrollReveal from './components/ScrollReveal';
import SectionBackground from './components/SectionBackground';
import ZenCursorHalo from './components/ZenCursorHalo';

// Pages
import MandalaSessionPage from './pages/MandalaSession';
import CommunityPage from './pages/Community';
import AdminDashboard from './pages/AdminDashboard';

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

const BhuviSignature = ({ theme }) => (
  <span className="relative inline-block px-4 group">
    <span className={`relative z-10 font-script text-4xl ${theme.text} transition-all duration-500 group-hover:scale-110 group-hover:rotate-2 inline-block cursor-default`}>
        Bhuvi
    </span>
    <span className={`absolute -bottom-1 left-0 right-0 h-0.5 ${theme.bg} opacity-20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
    <span className="absolute -top-1 -right-2 text-pink-400 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse text-xs">
        ♥
    </span>
  </span>
);

const HomePage = () => {
  const { theme } = useTheme();
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Zen Quote - Spaced out more */}
      <ScrollReveal>
        <div className="py-24">
            <ZenQuote />
        </div>
      </ScrollReveal>

      <SectionDivider />

      {/* Welcome Message - Redisigned for Bhuvi */}
      <ScrollReveal>
        <div className="max-w-6xl mx-auto px-4 py-32 relative overflow-hidden">
          {/* Background Decorations */}
          <div className={`${theme.svgColor} opacity-[0.08]`}>
            <SectionBackground pattern="lotus" position="center" size={900} spin="slower" />
            <SectionBackground pattern="ripple" position="topRight" size={500} spin="reverse" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
             {/* Floating Flower ornaments */}
            <div className="mb-12 flex gap-8 items-center">
                <div className={`${theme.svgColor} opacity-40 animate-bounce-slow`}>
                    <PatternFlower size={48} spin="animate-spin-slow" />
                </div>
                <div className={`w-24 h-px ${theme.bg} opacity-10`} />
                <div className={`${theme.svgColor} opacity-40 animate-bounce-slow [animation-delay:0.5s]`}>
                    <PatternFlower size={48} spin="animate-spin-reverse" />
                </div>
            </div>

            <div className="glass-card rounded-[3rem] p-12 md:p-20 text-center shadow-2xl backdrop-blur-3xl border border-white/5 relative overflow-hidden group">
                {/* Internal accent */}
                <div className={`absolute top-0 left-0 w-full h-1 ${theme.bg} opacity-20`} />
                
                <h3 className="font-display text-4xl md:text-6xl text-gray-800 dark:text-white mb-10 tracking-tight leading-tight">
                    Hi there! <span className="animate-wave inline-block transform origin-bottom-right opacity-80">😊</span>
                </h3>

                <p className="text-xl md:text-3xl text-gray-600 dark:text-gray-300 leading-relaxed font-body font-light max-w-4xl mx-auto italic mb-12">
                     Welcome to <span className={`font-semibold ${theme.textLight}`}>Mandala Therapy</span>.
                     I am <BhuviSignature theme={theme} /> and I love drawing mandalas as a unique form of self-expression.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm uppercase tracking-widest text-gray-400 font-body">
                    <div className="flex flex-col items-center gap-3 group-hover:translate-y-[-4px] transition-transform duration-500">
                        <div className={`w-1 h-1 rounded-full ${theme.bg} opacity-40`} />
                        Reduce Stress
                    </div>
                    <div className="flex flex-col items-center gap-3 group-hover:translate-y-[-4px] transition-transform duration-500 delay-75">
                         <div className={`w-1 h-1 rounded-full ${theme.bg} opacity-40`} />
                        Self Expression
                    </div>
                    <div className="flex flex-col items-center gap-3 group-hover:translate-y-[-4px] transition-transform duration-500 delay-150">
                         <div className={`w-1 h-1 rounded-full ${theme.bg} opacity-40`} />
                        Inner Peace
                    </div>
                </div>
            </div>
            
             <p className="mt-16 text-lg text-gray-500 dark:text-gray-400 font-body max-w-2xl text-center leading-relaxed">
              Browse the gallery, colour the mandala of the day, write affirmations,
              and let the soothing sounds calm your mind. This space is all about <em>you</em>. 🌸
            </p>
          </div>
        </div>
      </ScrollReveal>

      <SectionDivider />

      {/* Breathing Exercise - More padding */}
      <ScrollReveal>
        <div className="py-12">
            <BreatheCircle />
        </div>
      </ScrollReveal>

      <SectionDivider />

      {/* Mandala of the Day - Side-by-side spread */}
      <ScrollReveal>
        <div className="py-24">
            <MandalaOfTheDay />
        </div>
      </ScrollReveal>

      {/* Gallery - Portraits spread */}
      <ScrollReveal>
        <div className="py-24">
            <Gallery />
        </div>
      </ScrollReveal>

      <SectionDivider />

      {/* Affirmation Journal - Open BookSpread */}
      <ScrollReveal>
        <div className="py-24">
            <AffirmationJournal />
        </div>
      </ScrollReveal>

      <SectionDivider />

      {/* Music Player - Spread layout */}
      <ScrollReveal>
        <div className="py-24">
            <MusicPlayer />
        </div>
      </ScrollReveal>
    </>
  );
};

function App() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme.bgSolid} transition-colors duration-700 font-body relative overflow-x-hidden`}>
      {/* Floating Particles & Cursor Magic */}
      <ParticleBackground />
      <ZenCursorHalo />

      {/* Persistent Elements */}
      <Navbar />
      <DailyStreak />

      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/session" element={<MandalaSessionPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
