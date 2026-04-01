import React, { useEffect, useState, useCallback } from 'react';
import { useTheme } from '../ThemeContext';

const FALLBACK_QUOTES = [
  { q: "Peace begins with a smile.", a: "Mother Teresa" },
  { q: "The mind is everything. What you think you become.", a: "Buddha" },
  { q: "Happiness is not something ready-made. It comes from your own actions.", a: "Dalai Lama" },
  { q: "In the middle of difficulty lies opportunity.", a: "Albert Einstein" },
  { q: "Be yourself; everyone else is already taken.", a: "Oscar Wilde" },
  { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
  { q: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", a: "Ralph Waldo Emerson" },
  { q: "Calm mind brings inner strength and self-confidence.", a: "Dalai Lama" },
  { q: "Almost everything will work again if you unplug it for a few minutes, including you.", a: "Anne Lamott" },
  { q: "The present moment is the only moment available to us, and it is the door to all moments.", a: "Thich Nhat Hanh" },
];

const ZenQuote = () => {
  const { theme } = useTheme();
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    setFadeIn(false);
    try {
      const res = await fetch('/api/random');
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      if (data && data[0] && data[0].q) {
        setQuote(data[0].q);
        setAuthor(data[0].a);
      } else {
        throw new Error('Invalid data');
      }
    } catch {
      const randomQuote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      setQuote(randomQuote.q);
      setAuthor(randomQuote.a);
    } finally {
      setLoading(false);
      setTimeout(() => setFadeIn(true), 150);
    }
  }, []);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="relative py-20 px-8 text-center group">
        
        {/* Decorative corner elements */}
        <div className={`absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 ${theme.border} opacity-20 transition-all duration-700 group-hover:w-32 group-hover:h-32 group-hover:opacity-40`} />
        <div className={`absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 ${theme.border} opacity-20 transition-all duration-700 group-hover:w-32 group-hover:h-32 group-hover:opacity-40`} />

        {/* Floating background ornament */}
        <div className={`absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05] pointer-events-none`}>
            <svg viewBox="0 0 100 100" className="w-96 h-96 animate-spin-slower">
                <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="currentColor" />
            </svg>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
            {loading ? (
                <div className="space-y-4 py-12">
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-full shimmer-loading opacity-50" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-2/3 mx-auto shimmer-loading opacity-40" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-24 mx-auto shimmer-loading opacity-30 mt-8" />
                </div>
            ) : (
                <div className={`transition-all duration-1000 transform ${fadeIn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}>
                    
                    <div className="mb-10">
                        <svg className={`w-12 h-12 mx-auto ${theme.textLight} opacity-20 mb-4`} fill="currentColor" viewBox="0 0 32 32">
                            <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-2.2 1.8-4 4-4V8h-2zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8h-2z" />
                        </svg>
                    </div>

                    <p className={`font-display text-2xl md:text-4xl italic ${theme.text} leading-snug mb-10 tracking-tight`}>
                        &ldquo;{quote}&rdquo;
                    </p>

                    <div className="flex items-center justify-center gap-6">
                        <div className={`w-12 h-px ${theme.bg} opacity-20`} />
                        <p className={`font-script text-2xl ${theme.textLight} tracking-wide`}>
                            — {author}
                        </p>
                        <div className={`w-12 h-px ${theme.bg} opacity-20`} />
                    </div>

                    <button
                        onClick={fetchQuote}
                        disabled={loading}
                        className={`mt-16 group/btn inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-medium font-body transition-all duration-500 glass-card border border-white/10 hover:border-white/30 ${theme.text} hover:shadow-2xl overflow-hidden relative`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r ${theme.bg} opacity-0 group-hover/btn:opacity-10 transition-opacity`} />
                        <svg
                            className={`w-5 h-5 transition-transform duration-700 ${loading ? 'animate-spin' : 'group-hover/btn:rotate-180'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reflect Again
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ZenQuote;
