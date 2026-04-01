import React, { useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import SectionBackground from '../components/SectionBackground';
import ScrollReveal from '../components/ScrollReveal';

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
    <span className="relative inline-block px-1 group cursor-default">
      <span className={`relative z-10 font-script text-4xl md:text-5xl ${theme.text} transition-all duration-500 group-hover:scale-110 group-hover:rotate-2 inline-block`}>
          Bhuvi
      </span>
      <span className={`absolute -bottom-1 left-0 right-0 h-0.5 ${theme.bg} opacity-20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
      <span className="absolute -top-1 -right-2 text-pink-400 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse text-xs">
          ♥
      </span>
    </span>
);

const MandalaSessionPage = () => {
    const { theme } = useTheme();
    const fiverrLink = "https://www.fiverr.com/bhuvi_16/teach-you-how-to-draw-mandalas-for-mindfulness";

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={`min-h-screen ${theme.bgSolid} relative overflow-hidden flex flex-col font-body pb-32`}>
            {/* Background Decorative */}
            <div className={`${theme.svgColor} opacity-[0.05]`}>
                <SectionBackground pattern="ripple" position="center" size={1400} spin="slower" />
                <SectionBackground pattern="lotus" position="bottom" size={800} spin="reverse" />
            </div>

            {/* Immersive Landing Section */}
            <header className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 text-center">
                 {/* Decorative floating flowers */}
                 <div className="absolute top-24 left-10 md:left-32 opacity-20 animate-float">
                     <PatternFlower size={120} className={theme.svgColor} />
                 </div>
                 <div className="absolute bottom-24 right-10 md:right-32 opacity-10 animate-float [animation-delay:1s]">
                     <PatternFlower size={180} className={theme.svgColor} spin="animate-spin-reverse" />
                 </div>

                <ScrollReveal>
                    <div className="max-w-4xl mx-auto flex flex-col items-center">
                        <span className={`text-xs font-bold uppercase tracking-[0.4em] ${theme.textLight} mb-6 opacity-60`}>Exclusive Experience</span>
                        <h1 className="section-title text-7xl md:text-[10rem] mb-12 tracking-tighter leading-none">
                            Inner Circle
                        </h1>
                        
                        <div className="flex flex-col items-center gap-8">
                             <p className="text-xl md:text-3xl text-gray-500 dark:text-gray-400 font-body font-light leading-relaxed max-w-2xl italic">
                                &ldquo;Hi, I am <BhuviSignature theme={theme} />, an artist offering mandala experiences that help you reconnect with yourself through intentional design and reflection.&rdquo;
                            </p>
                        </div>

                        <div className={`mt-16 w-16 h-px ${theme.bg} opacity-20 animate-pulse`} />
                    </div>
                </ScrollReveal>
            </header>

            <main className="max-w-7xl mx-auto px-4">
                
                {/* Services Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative">
                    
                    {/* Floating Aura */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[120%] bg-gradient-to-br ${theme.heroGradient} opacity-[0.03] blur-[120px] pointer-events-none rounded-full`} />

                    {/* Option 1: I Draw for You */}
                    <ScrollReveal>
                        <div className="group relative h-full">
                            <div className="absolute -inset-2 rounded-[4rem] bg-gradient-to-br from-white/10 to-transparent opacity-50 blur-xl group-hover:opacity-100 transition-all duration-1000" />
                            
                            <div className="relative h-full glass-strong rounded-[3.5rem] p-12 md:p-16 border border-white/10 flex flex-col shadow-2xl backdrop-blur-2xl hover:bg-white/[0.05] transition-all">
                                <div className="mb-10 flex items-center justify-between">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${theme.bgLight} ${theme.text} shadow-inner`}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                             <circle cx="12" cy="12" r="10" />
                                             <path d="M12 2a10 10 0 0 1 10 10" opacity="0.3" />
                                        </svg>
                                    </div>
                                    <span className="text-[10px] items-center flex gap-2 font-bold uppercase tracking-[0.2em] text-gray-400">
                                        <div className={`w-1.5 h-1.5 rounded-full ${theme.bg} opacity-40`} />
                                        Digital Product
                                    </span>
                                </div>
                                
                                <h3 className={`font-display text-4xl md:text-5xl ${theme.text} mb-8 tracking-tight`}>
                                    Custom <span className="italic">Gifts</span> <br/> 
                                    <span className="opacity-50 text-2xl font-body">& Hand-Drawn Art</span>
                                </h3>
                                
                                <p className="text-xl text-gray-600 dark:text-gray-400 font-body font-light leading-relaxed mb-12 flex-1">
                                    I'll create a custom mandala artwork based on your word, phrase, or mood. It's a unique piece, hand-drawn and full of meaning, delivered as a high-quality digital picture.
                                </p>

                                <a 
                                    href={fiverrLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-full group/btn relative overflow-hidden bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-6 rounded-2xl text-2xl font-bold text-center shadow-2xl transition-all hover:scale-[1.03] active:scale-95`}
                                >
                                    <span className="relative z-10">Order Custom Art ✨</span>
                                    <div className={`absolute inset-0 bg-gradient-to-r ${theme.bg} opacity-0 group-hover/btn:opacity-20 transition-opacity`} />
                                </a>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Option 2: We Create Together */}
                    <ScrollReveal delay={200}>
                        <div className="group relative h-full">
                             <div className="absolute -inset-2 rounded-[4rem] bg-gradient-to-br from-white/10 to-transparent opacity-50 blur-xl group-hover:opacity-100 transition-all duration-1000" />
                            
                            <div className="relative h-full glass-strong rounded-[3.5rem] p-12 md:p-16 border border-white/10 flex flex-col shadow-2xl backdrop-blur-2xl hover:bg-white/[0.05] transition-all">
                                <div className="mb-10 flex items-center justify-between">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${theme.bg} text-white shadow-lg`}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                             <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                             <circle cx="9" cy="7" r="4" />
                                             <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                             <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                    </div>
                                     <span className="text-[10px] items-center flex gap-2 font-bold uppercase tracking-[0.2em] text-gray-400">
                                        <div className={`w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-40 animate-pulse`} />
                                        Live Session
                                    </span>
                                </div>
                                
                                <h3 className={`font-display text-4xl md:text-5xl ${theme.text} mb-8 tracking-tight`}>
                                    Guided <span className="italic">Meditation</span> <br/>
                                    <span className="opacity-50 text-2xl font-body">& Shared Creation</span>
                                </h3>
                                
                                <p className="text-xl text-gray-600 dark:text-gray-400 font-body font-light leading-relaxed mb-12 flex-1">
                                    A one-on-one calming session where I walk you through the process, helping you reflect, focus, and create a mandala of your own. No artistic experience needed!
                                </p>

                                <a 
                                    href={fiverrLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-full group/btn relative overflow-hidden ${theme.btnPrimary} py-6 rounded-2xl text-2xl font-bold text-center shadow-2xl transition-all hover:scale-[1.03] active:scale-95 ${theme.glow}`}
                                >
                                    <span className="relative z-10">Book a Session ✨</span>
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                                </a>
                            </div>
                        </div>
                    </ScrollReveal>

                </div>

                {/* Closing Message */}
                <ScrollReveal>
                    <div className="mt-48 text-center bg-white/5 dark:bg-black/20 rounded-[4rem] p-16 md:p-24 border border-white/5 relative overflow-hidden backdrop-blur-3xl">
                        {/* Internal Pattern */}
                        <div className={`absolute inset-0 opacity-[0.03] ${theme.svgColor} pointer-events-none`}>
                             <SectionBackground pattern="mandala" position="center" size={1000} spin="slower" />
                        </div>
                        
                        <h4 className={`font-display text-3xl md:text-5xl ${theme.text} mb-10 max-w-3xl mx-auto leading-tight italic`}>
                            &ldquo;I am sure you'll love it! Just take the first step towards your creative peace.&rdquo;
                        </h4>
                        
                        <p className="text-gray-500 dark:text-gray-400 font-body text-xl tracking-widest uppercase mb-12">
                            Message me for further details
                        </p>
                        
                        <div className="flex justify-center gap-6">
                             <div className={`w-1 h-1 rounded-full ${theme.bg} opacity-20`} />
                             <div className={`w-3 h-3 rounded-full ${theme.bg} opacity-40`} />
                             <div className={`w-1 h-1 rounded-full ${theme.bg} opacity-20`} />
                        </div>
                    </div>
                </ScrollReveal>

            </main>
        </div>
    );
};

export default MandalaSessionPage;
