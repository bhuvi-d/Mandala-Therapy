import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import SectionBackground from './SectionBackground';

const CornerFlower = ({ className = '', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="currentColor" className={className}>
    {[0, 60, 120, 180, 240, 300].map((angle, i) => {
      const r = (angle * Math.PI) / 180;
      return (
        <ellipse
          key={i}
          cx={20 + Math.cos(r) * 8}
          cy={20 + Math.sin(r) * 8}
          rx={3.5}
          ry={9}
          transform={`rotate(${angle + 90}, ${20 + Math.cos(r) * 8}, ${20 + Math.sin(r) * 8})`}
          opacity="0.6"
        />
      );
    })}
    <circle cx="20" cy="20" r="3.5" opacity="0.8" />
  </svg>
);

const VineDivider = ({ className = '' }) => (
  <svg viewBox="0 0 400 20" className={`w-full h-4 ${className}`} fill="none" stroke="currentColor">
    <path d="M0 10 Q100 0 200 10 Q300 20 400 10" strokeWidth="1" strokeDasharray="4 4" />
    <circle cx="200" cy="10" r="3" fill="currentColor" opacity="0.5" />
    <path d="M180 10 Q190 0 200 10" strokeWidth="1.5" />
    <path d="M220 10 Q210 20 200 10" strokeWidth="1.5" />
  </svg>
);

const promptSuggestions = [
  "I am exactly where I need to be.",
  "I inhale peace and exhale worry.",
  "My heart is open to the beauty of now.",
  "I trust the timing of my life.",
  "I am worthy of rest and stillness.",
  "Peace flows through me like a gentle river.",
  "I release what I cannot control.",
];

const AffirmationJournal = () => {
  const { theme } = useTheme();
  const [affirmation, setAffirmation] = useState('');
  const [journal, setJournal] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [deletedEntry, setDeletedEntry] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('mandala-journal');
    if (saved) setJournal(JSON.parse(saved));
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem('mandala-journal', JSON.stringify(data));
  };

  const handleAddAffirmation = () => {
    if (!affirmation.trim()) return;
    
    const newEntry = {
      id: Date.now(),
      text: affirmation,
      date: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    const updatedJournal = [newEntry, ...journal];
    setJournal(updatedJournal);
    saveToLocalStorage(updatedJournal);
    setAffirmation('');
    
    setToastMessage('Affirmation sealed in your journal 🍯');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDelete = (id) => {
    const entryToDelete = journal.find(item => item.id === id);
    setDeletedEntry(entryToDelete);
    
    const updatedJournal = journal.filter(item => item.id !== id);
    setJournal(updatedJournal);
    saveToLocalStorage(updatedJournal);
    
    setToastMessage('Page torn out. Peace remains.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleUndo = () => {
    if (deletedEntry) {
      const updatedJournal = [deletedEntry, ...journal].sort((a,b) => b.id - a.id);
      setJournal(updatedJournal);
      saveToLocalStorage(updatedJournal);
      setDeletedEntry(null);
      setShowToast(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddAffirmation();
    }
  };

  return (
    <section id="journal" className="py-24 px-4 relative overflow-hidden">
      <div className={`${theme.svgColor} opacity-[0.05]`}>
        <SectionBackground pattern="ripple" position="bottom" size={1000} spin="slower" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className={`section-title text-5xl md:text-7xl ${theme.text} mb-4`}>
            Affirmation Journal
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xl font-body max-w-2xl mx-auto italic">
            Whisper your intentions onto these digital pages. A sanctuary for your thoughts and reflections.
          </p>
        </div>

        {/* ═══════ THE OPEN BOOK SPREAD ═══════ */}
        <div className="relative group">
          {/* Main Book Structure */}
          <div className="flex flex-col lg:flex-row min-h-[650px] rounded-[2.5rem] border-2 border-amber-900/10 dark:border-white/10 shadow-2xl overflow-hidden relative bg-white/50 dark:bg-black/50">
            
            {/* Spine Shadow Effect */}
            <div className="absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-gradient-to-r from-black/5 via-black/20 to-black/5 z-20 hidden lg:block" />

            {/* LEFT PAGE: WRITING PAGE */}
            <div className="flex-none lg:w-1/2 bg-white/95 dark:bg-gray-900/95 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-amber-900/5 dark:border-white/5 relative flex flex-col">
              {/* Paper Lines */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
                style={{
                  backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, currentColor 31px, currentColor 32px)`,
                  backgroundPosition: '0 40px',
                }}
              />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-8">
                  <CornerFlower className={`${theme.svgColor} animate-spin-slow`} size={40} />
                  <div>
                    <h3 className={`font-display text-2xl ${theme.text} italic`}>Set Your Intention</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">New Entry</p>
                  </div>
                </div>

                <div className="flex-1">
                    <textarea
                        className={`w-full p-0 border-none text-xl bg-transparent text-gray-800 dark:text-white resize-none font-body placeholder:text-gray-300 dark:placeholder:text-gray-600 placeholder:italic focus:outline-none min-h-[300px]`}
                        placeholder="What does your soul need to hear today?"
                        value={affirmation}
                        onChange={(e) => setAffirmation(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ lineHeight: '32px' }}
                    />
                </div>

                <div className="mt-8 border-t border-dashed border-gray-200 dark:border-gray-800 pt-8">
                  <p className="text-xs text-gray-400 mb-4 font-body tracking-wider uppercase">Whispered inspirations</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {promptSuggestions.slice(0, 4).map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => setAffirmation(suggestion)}
                        className={`text-xs px-4 py-2 rounded-full border ${theme.border} ${theme.textMuted} hover:${theme.bgLight} transition-all font-body italic`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleAddAffirmation}
                    disabled={!affirmation.trim()}
                    className={`w-full ${theme.btnPrimary} py-5 rounded-2xl text-xl shadow-lg border border-white/10 ${theme.glow} transition-all font-display tracking-widest transform hover:-translate-y-1 active:scale-95`}
                  >
                    Seal this Page
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT PAGE: READING PAGE */}
            <div className="flex-none lg:w-1/2 bg-white/90 dark:bg-gray-800/90 p-8 md:p-12 relative flex flex-col">
               {/* Paper Lines */}
               <div className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.04]"
                style={{
                  backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, currentColor 31px, currentColor 32px)`,
                  backgroundPosition: '0 40px',
                }}
              />

              <div className="relative z-10 flex flex-col h-full">
                <div className="text-center mb-10">
                  <h3 className={`font-display text-2xl ${theme.text} italic`}>Past Reflections</h3>
                  <div className={`w-12 h-0.5 ${theme.bg} mx-auto mt-2 opacity-50`} />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 max-h-[600px]">
                    {journal.length === 0 ? (
                    <div className="text-center py-20 opacity-40">
                        <p className="font-display text-2xl italic">Blank pages await your story...</p>
                    </div>
                    ) : (
                    <div className="space-y-12">
                        {journal.map((entry, index) => (
                        <div key={entry.id} className="relative group/entry">
                            <p className="text-xl text-gray-800 dark:text-gray-100 font-body leading-relaxed italic pr-8">
                            &ldquo;{entry.text}&rdquo;
                            </p>
                            <div className="flex items-center justify-between mt-4">
                            <span className="text-xs text-gray-400 font-body uppercase tracking-tighter">{entry.date}</span>
                            <button
                                onClick={() => handleDelete(entry.id)}
                                className="opacity-0 group-hover/entry:opacity-100 text-xs text-red-500 hover:text-red-600 transition-all font-bold"
                            >
                                Tear out
                            </button>
                            </div>
                            {index < journal.length - 1 && <VineDivider className={`mt-8 ${theme.svgColor} opacity-50`} />}
                        </div>
                        ))}
                    </div>
                    )}
                </div>

                {/* BOTTOM ACCENT (Parallel to Seal Button) */}
                <div className="mt-8 border-t border-dashed border-gray-200 dark:border-gray-800 pt-8 flex items-center justify-center">
                    <div className="text-center opacity-30 select-none">
                        <svg className={`w-12 h-12 mx-auto ${theme.textLight} mb-2 animate-spin-slower`} fill="currentColor" viewBox="0 0 100 100">
                             {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                                <ellipse key={i} cx="50" cy="50" rx="4" ry="12" transform={`rotate(${angle}, 50, 50)`} />
                             ))}
                        </svg>
                        <p className="font-script text-xl tracking-tight italic">Sanctuary of peace</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements around the book */}
          <div className="absolute -top-10 -left-10 z-30 pointer-events-none">
            <CornerFlower className={`${theme.svgColor} opacity-50 animate-pulse-soft`} size={120} />
          </div>
          <div className="absolute -bottom-14 -right-14 z-30 pointer-events-none rotate-180">
            <CornerFlower className={`${theme.svgColor} opacity-40 animate-spin-reverse`} size={140} />
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-up">
          <div className="glass-card rounded-[2rem] px-8 py-4 shadow-2xl text-base font-medium text-gray-700 dark:text-gray-200 flex items-center gap-3 font-body border border-white/20 backdrop-blur-3xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="flex-1">{toastMessage}</span>
            {deletedEntry && (
              <button 
                onClick={handleUndo}
                className={`${theme.textLight} font-bold ml-4 hover:underline transition-all`}
              >
                Undo
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AffirmationJournal;
