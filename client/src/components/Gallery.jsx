import React, { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../ThemeContext';
import SectionBackground from './SectionBackground';

const fallbackMandalas = [
  {
    _id: "1",
    title: "Celestial Beginning",
    imageUrl: "https://res.cloudinary.com/dvsclqyjm/image/upload/v1751213748/img1_hzmflj.jpg",
    description: "The spark of an infinite journey"
  },
  {
    _id: "2",
    title: "Golden Asymmetry",
    imageUrl: "https://res.cloudinary.com/dvsclqyjm/image/upload/v1751213780/img2_vgg8ly.jpg",
    description: "Finding balance in the unexpected"
  },
  {
    _id: "3",
    title: "Deep Void",
    imageUrl: "https://res.cloudinary.com/dvsclqyjm/image/upload/v1751213792/img3_okxf3p.jpg",
    description: "Quiet power within the silence"
  }
];

const createMeditationMusic = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 3);
    masterGain.connect(ctx.destination);

    const delay = ctx.createDelay();
    delay.delayTime.value = 0.4;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.35;
    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.value = 2000;
    delay.connect(delayFilter);
    delayFilter.connect(feedback);
    feedback.connect(delay);
    feedback.connect(masterGain);

    const delay2 = ctx.createDelay();
    delay2.delayTime.value = 0.65;
    const feedback2 = ctx.createGain();
    feedback2.gain.value = 0.2;
    delay2.connect(feedback2);
    feedback2.connect(delay2);
    feedback2.connect(masterGain);

    const notes = [
      261.63, 293.66, 329.63, 392.00, 440.00,
      523.25, 587.33, 659.26, 783.99, 880.00,
      130.81, 146.83, 164.81, 196.00, 220.00,
    ];

    const patterns = [
      [0, 2, 4, 7, 4, 2, 5, 3],
      [1, 3, 5, 8, 5, 3, 6, 4],
      [0, 4, 7, 5, 2, 6, 3, 1],
      [10, 0, 2, 4, 7, 5, 3, 0],
    ];

    let currentPattern = 0;
    let noteIndex = 0;
    const noteDuration = 0.8;
    const noteGap = 0.15;
    const allOscillators = [];
    let isRunning = true;

    const playNote = (freq, time) => {
      if (!isRunning) return;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = freq * 2;
      osc2.detune.value = 5;
      const noteGain = ctx.createGain();
      noteGain.gain.value = 0;
      noteGain.gain.linearRampToValueAtTime(0.12, time + 0.08);
      noteGain.gain.linearRampToValueAtTime(0.08, time + 0.2);
      noteGain.gain.linearRampToValueAtTime(0, time + noteDuration);
      const overtoneGain = ctx.createGain();
      overtoneGain.gain.value = 0;
      overtoneGain.gain.linearRampToValueAtTime(0.02, time + 0.08);
      overtoneGain.gain.linearRampToValueAtTime(0, time + noteDuration * 0.7);
      osc.connect(noteGain);
      osc2.connect(overtoneGain);
      noteGain.connect(masterGain);
      noteGain.connect(delay);
      noteGain.connect(delay2);
      overtoneGain.connect(masterGain);
      osc.start(time);
      osc.stop(time + noteDuration + 0.1);
      osc2.start(time);
      osc2.stop(time + noteDuration + 0.1);
      allOscillators.push(osc, osc2);
    };

    const scheduleNext = () => {
      if (!isRunning) return;
      const pattern = patterns[currentPattern];
      const noteIdx = pattern[noteIndex];
      const freq = notes[noteIdx];
      playNote(freq, ctx.currentTime + noteGap);
      noteIndex++;
      if (noteIndex >= pattern.length) {
        noteIndex = 0;
        currentPattern = (currentPattern + 1) % patterns.length;
      }
    };

    const intervalId = setInterval(scheduleNext, (noteDuration + noteGap) * 1000);
    scheduleNext();

    const padNotes = [130.81, 196.00, 261.63];
    const padOscs = padNotes.map(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 4);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      allOscillators.push(osc);
      return { osc, gain };
    });

    return {
      ctx,
      masterGain,
      intervalId,
      allOscillators,
      padOscs,
      stop: () => {
        isRunning = false;
        if (intervalId) clearInterval(intervalId);
        masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
        padOscs.forEach(p => p.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2));
        setTimeout(() => {
          allOscillators.forEach(o => { try { o.stop(); } catch (e) {} });
          padOscs.forEach(p => { try { p.osc.stop(); } catch (e) {} });
          try { ctx.close(); } catch (e) {}
        }, 2500);
      }
    };
  } catch (e) {
    console.error('Music creation failed:', e);
    return null;
  }
};

const Gallery = () => {
  const { theme } = useTheme();
  const [mandalas, setMandalas] = useState(fallbackMandalas);
  const [selectedMandala, setSelectedMandala] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const musicRef = useRef(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/gallery");
        if (res.data && res.data.length > 0) {
          setMandalas(res.data);
        }
      } catch (err) {
        console.log("Using sanctuary fallbacks.");
      }
    };
    fetchGallery();
  }, []);

  const startMusic = useCallback(() => {
    if (musicRef.current) musicRef.current.stop();
    const music = createMeditationMusic();
    musicRef.current = music;
  }, []);

  const stopMusic = useCallback(() => {
    if (musicRef.current) {
      musicRef.current.stop();
      musicRef.current = null;
    }
  }, []);

  const handleOpen = (mandala) => {
    setSelectedMandala(mandala);
    startMusic();
    setIsPlaying(true);
  };

  const handleClose = () => {
    setSelectedMandala(null);
    stopMusic();
    setIsPlaying(false);
  };

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <section id="gallery" className="py-24 px-4 relative overflow-hidden">
      <div className={`${theme.svgColor} opacity-30`}>
        <SectionBackground pattern="flowerOfLife" position="right" size={800} spin="reverse" />
        <SectionBackground pattern="starBurst" position="bottomLeft" size={600} spin="slow" />
        <SectionBackground pattern="lotus" position="topLeft" size={400} spin="slower" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className={`section-title text-5xl md:text-7xl ${theme.text} mb-6`}>
            Vibrant Collections
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xl font-body max-w-3xl mx-auto italic">
            Each mandala is a mirror of the mind. Explore, reflect, and click any piece to immerse yourself in a melodic meditation.
          </p>
          
          {isPlaying && (
            <div className={`inline-flex items-center gap-3 mt-8 px-6 py-3 rounded-full glass-card border border-white/20 ${theme.text} text-base animate-fade-in shadow-2xl`}>
              <div className="flex gap-1 items-end h-4">
                 {Array.from({ length: 5 }).map((_, i) => (
                   <div key={i} className={`w-1 ${theme.bg} rounded-full animate-wave`} style={{ height: `${20 + i * 20}%`, animationDelay: `${i * 0.1}s` }} />
                 ))}
              </div>
              <span className="font-display italic tracking-wider">Breathing Art Melodies</span>
              <button onClick={handleClose} className="ml-2 hover:text-red-400 transition-colors">×</button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {mandalas.map((mandala) => (
            <div
              key={mandala._id}
              onClick={() => handleOpen(mandala)}
              className="group relative"
            >
              <div className={`absolute -inset-2 rounded-[2.5rem] ${theme.particle} opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-700 pointer-events-none`} />
              
              <div className="relative glass-card rounded-[2.5rem] overflow-hidden cursor-pointer border border-white/5 group-hover:border-white/20 shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-[1.03]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  {!loadedImages[mandala._id] && (
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 shimmer-loading" />
                  )}
                  <img
                    src={mandala.imageUrl}
                    alt={mandala.title}
                    className={`w-full h-full object-cover transform transition-all duration-[6s] ease-out group-hover:scale-125 ${!loadedImages[mandala._id] ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => handleImageLoad(mandala._id)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Floating Action Hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                    <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 text-white font-display text-lg shadow-2xl">
                        Immerse in Art
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="font-display text-3xl font-semibold mb-2 drop-shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {mandala.title}
                    </h3>
                    <p className="text-sm text-white/70 font-body italic opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                        {mandala.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      {selectedMandala && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-fade-in"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
          
          <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
             <button
              onClick={handleClose}
              className="absolute top-0 right-0 m-8 w-16 h-16 rounded-full glass-card border border-white/20 text-white text-4xl flex items-center justify-center hover:bg-white/10 transition-all z-50 animate-bounce-slow"
            >
              ×
            </button>

            <div className="relative w-full max-w-4xl max-h-[80vh] group">
                <div className={`absolute -inset-20 rounded-full ${theme.particle} opacity-30 blur-[100px] animate-pulse-soft`} />
                <img
                    src={selectedMandala.url}
                    alt={selectedMandala.title}
                    className="relative z-10 w-full h-full object-contain rounded-3xl shadow-[0_0_80px_rgba(255,255,255,0.1)] transition-transform duration-1000 group-hover:scale-105"
                />
            </div>

            <div className="relative z-10 text-center mt-12 animate-fade-in-up">
              <h3 className="text-white font-display text-4xl md:text-6xl font-semibold mb-4 tracking-tight">
                {selectedMandala.title}
              </h3>
              <p className="text-gray-400 text-xl font-body italic max-w-2xl mx-auto">
                &ldquo;{selectedMandala.description}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
