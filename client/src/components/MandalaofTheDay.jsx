import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import MandalaColoringPopup from './MandalaColouringPopup';
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

const mandalas = [
  {
    id: 1,
    title: "Celestial Beginning",
    description: "The core represents the spark of an idea, expanding infinitely outward into the universe of your potential.",
    url: "https://res.cloudinary.com/dvsclqyjm/image/upload/v1751213748/img1_hzmflj.jpg"
  },
  {
    id: 2,
    title: "Fluid Asymmetry",
    description: "Embrace the beauty of imperfection. Flowing lines remind us that balance isn't always about perfect mirror images.",
    url: "https://res.cloudinary.com/dvsclqyjm/image/upload/v1751213780/img2_vgg8ly.jpg"
  },
  {
    id: 3,
    title: "Silent Void",
    description: "In the stillness of the center, find your peace. The surrounding patterns dance around the quiet strength of your soul.",
    url: "https://res.cloudinary.com/dvsclqyjm/image/upload/v1751213792/img3_okxf3p.jpg"
  },
];

const getMandalaOfTheDay = (mandalas) => {
  const today = new Date().toISOString().slice(0, 10);
  const seed = [...today].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = seed % mandalas.length;
  return mandalas[index];
};

const MandalaOfTheDay = () => {
  const { theme } = useTheme();
  const [showColoring, setShowColoring] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const mandala = getMandalaOfTheDay(mandalas);
  const today = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section id="mandala-of-day" className="py-24 px-4 relative overflow-hidden">
      <div className={`${theme.svgColor} opacity-25`}>
        <SectionBackground pattern="starBurst" position="left" size={600} spin="slower" />
        <SectionBackground pattern="flowerOfLife" position="topRight" size={400} spin="reverse" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* LEFT: Text Info */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
             <p className={`font-script text-2xl ${theme.textLight} mb-2`}>
                {today}
            </p>
            <h2 className={`font-display text-5xl md:text-7xl ${theme.text} mb-8`}>
              The Daily Mandala
            </h2>
            
            <div className="space-y-6 mb-12">
                <h3 className={`text-2xl font-body font-bold ${theme.text}`}>&ldquo;{mandala.title}&rdquo;</h3>
                <p className="text-xl text-gray-500 dark:text-gray-400 font-body leading-relaxed max-w-lg mx-auto lg:mx-0 italic">
                    {mandala.description}
                </p>
                <div className={`w-16 h-1 ${theme.bg} mx-auto lg:mx-0 opacity-40`} />
            </div>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <button
                    onClick={() => setShowColoring(true)}
                    className={`btn-premium ${theme.btnPrimary} px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl transition-transform active:scale-95 flex items-center justify-center gap-3`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    Start Colouring
                </button>
            </div>
          </div>

          {/* RIGHT: The Mandala Art Display */}
          <div className="flex-1 order-1 lg:order-2">
            <div className="relative group">
               {/* Decorative glow behind art */}
                <div className={`absolute -inset-10 rounded-full ${theme.particle} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-1000`} />
                
                <div className="relative glass-card rounded-[3rem] overflow-hidden p-4 border border-white/10 shadow-2xl transform transition-all duration-700 hover:rotate-2 hover:scale-105">
                    {/* Shimmer while loading */}
                    {!imageLoaded && (
                    <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 shimmer-loading rounded-[2rem]" />
                    )}

                    <div className={`w-full aspect-square overflow-hidden rounded-[2rem] ${!imageLoaded ? 'hidden' : ''}`}>
                    <img
                        src={mandala.url}
                        alt={mandala.title}
                        className="w-full h-full object-contain transform transition-transform duration-[3s] group-hover:scale-125"
                        onLoad={() => setImageLoaded(true)}
                    />
                    </div>
                </div>

                {/* Aesthetic Corner Tags */}
                <div className="absolute top-0 right-0 p-8">
                     <CornerFlower className={`${theme.svgColor} opacity-50 animate-spin-slow`} size={60} />
                </div>
            </div>
          </div>

        </div>

        {showColoring && (
          <MandalaColoringPopup
            mandalaUrl={mandala.url}
            onClose={() => setShowColoring(false)}
          />
        )}
      </div>
    </section>
  );
};

export default MandalaOfTheDay;
