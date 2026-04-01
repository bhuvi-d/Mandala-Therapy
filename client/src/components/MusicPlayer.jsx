import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import SectionBackground from './SectionBackground';

/*
 * Generate colored noise buffers for natural-sounding ambient audio.
 * Brown noise = low-freq rumble (warm), Pink noise = balanced (natural).
 */
const createNoiseBuffer = (ctx, type = 'white', duration = 4) => {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(2, length, sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let lastOut = 0;
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;

      if (type === 'brown') {
        lastOut = (lastOut + (0.02 * white)) / 1.02;
        data[i] = lastOut * 3.5;
      } else if (type === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      } else {
        data[i] = white;
      }
    }
  }
  return buffer;
};

const soundConfigs = [
  {
    id: 'rain',
    name: 'Rain',
    emoji: '🌧️',
    setup: (ctx) => {
      const buffer = createNoiseBuffer(ctx, 'pink', 4);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 1000;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 5000;
      bandpass.Q.value = 0.3;
      const gain = ctx.createGain();
      gain.gain.value = 0.6;
      source.connect(highpass);
      highpass.connect(bandpass);
      bandpass.connect(gain);
      return { source, gain, filters: [highpass, bandpass] };
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    emoji: '🌊',
    setup: (ctx) => {
      const buffer = createNoiseBuffer(ctx, 'brown', 4);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 600;
      lowpass.Q.value = 0.7;
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.07;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 400;
      lfo.connect(lfoGain);
      lfoGain.connect(lowpass.frequency);
      lfo.start();
      const volLfo = ctx.createOscillator();
      volLfo.type = 'sine';
      volLfo.frequency.value = 0.06;
      const volLfoGain = ctx.createGain();
      volLfoGain.gain.value = 0.15;
      volLfo.connect(volLfoGain);
      const gain = ctx.createGain();
      gain.gain.value = 0.5;
      volLfoGain.connect(gain.gain);
      volLfo.start();
      source.connect(lowpass);
      lowpass.connect(gain);
      return { source, gain, lfo: [lfo, volLfo], filters: [lowpass] };
    },
  },
  {
    id: 'wind',
    name: 'Wind',
    emoji: '🍃',
    setup: (ctx) => {
      const buffer = createNoiseBuffer(ctx, 'pink', 4);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 700;
      bandpass.Q.value = 1.5;
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.12;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 300;
      lfo.connect(lfoGain);
      lfoGain.connect(bandpass.frequency);
      lfo.start();
      const volLfo = ctx.createOscillator();
      volLfo.type = 'sine';
      volLfo.frequency.value = 0.18;
      const volLfoGain = ctx.createGain();
      volLfoGain.gain.value = 0.2;
      volLfo.connect(volLfoGain);
      const gain = ctx.createGain();
      gain.gain.value = 0.4;
      volLfoGain.connect(gain.gain);
      volLfo.start();
      source.connect(bandpass);
      bandpass.connect(gain);
      return { source, gain, lfo: [lfo, volLfo], filters: [bandpass] };
    },
  },
  {
    id: 'fire',
    name: 'Fireplace',
    emoji: '🔥',
    setup: (ctx) => {
      const brownBuffer = createNoiseBuffer(ctx, 'brown', 4);
      const crackleBuffer = createNoiseBuffer(ctx, 'white', 4);
      const rumbleSource = ctx.createBufferSource();
      rumbleSource.buffer = brownBuffer;
      rumbleSource.loop = true;
      const rumbleFilter = ctx.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.value = 250;
      const rumbleGain = ctx.createGain();
      rumbleGain.gain.value = 0.6;
      rumbleSource.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      const crackleSource = ctx.createBufferSource();
      crackleSource.buffer = crackleBuffer;
      crackleSource.loop = true;
      const crackleFilter = ctx.createBiquadFilter();
      crackleFilter.type = 'bandpass';
      crackleFilter.frequency.value = 3000;
      crackleFilter.Q.value = 2;
      const crackleGain = ctx.createGain();
      crackleGain.gain.value = 0.08;
      const crackleLfo = ctx.createOscillator();
      crackleLfo.type = 'sawtooth';
      crackleLfo.frequency.value = 3;
      const crackleLfoGain = ctx.createGain();
      crackleLfoGain.gain.value = 0.06;
      crackleLfo.connect(crackleLfoGain);
      crackleLfoGain.connect(crackleGain.gain);
      crackleLfo.start();
      crackleSource.connect(crackleFilter);
      crackleFilter.connect(crackleGain);
      const gain = ctx.createGain();
      gain.gain.value = 0.5;
      rumbleGain.connect(gain);
      crackleGain.connect(gain);
      return {
        source: rumbleSource,
        extraSource: crackleSource,
        gain,
        lfo: [crackleLfo],
        filters: [rumbleFilter, crackleFilter],
      };
    },
  },
];

const MusicPlayer = () => {
  const { theme } = useTheme();
  const [activeSounds, setActiveSounds] = useState({});
  const [volumes, setVolumes] = useState({ rain: 0.5, ocean: 0.5, wind: 0.5, fire: 0.5 });
  const audioCtxRef = useRef(null);
  const nodesRef = useRef({});

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const toggleSound = useCallback((soundConfig) => {
    const id = soundConfig.id;
    if (activeSounds[id]) {
      const nodes = nodesRef.current[id];
      if (nodes) {
        const ctx = audioCtxRef.current;
        nodes.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        setTimeout(() => {
          try { nodes.source.stop(); } catch (e) {}
          try { if (nodes.extraSource) nodes.extraSource.stop(); } catch (e) {}
          try { if (nodes.lfo) nodes.lfo.forEach(l => l.stop()); } catch (e) {}
        }, 600);
      }
      delete nodesRef.current[id];
      setActiveSounds(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    const ctx = getAudioContext();
    const nodes = soundConfig.setup(ctx);
    nodes.gain.gain.value = 0;
    nodes.gain.connect(ctx.destination);
    nodes.gain.gain.linearRampToValueAtTime(volumes[id], ctx.currentTime + 1);
    nodes.source.start();
    if (nodes.extraSource) nodes.extraSource.start();
    nodesRef.current[id] = nodes;
    setActiveSounds(prev => ({ ...prev, [id]: true }));
  }, [activeSounds, volumes, getAudioContext]);

  const updateVolume = useCallback((id, value) => {
    setVolumes(prev => ({ ...prev, [id]: value }));
    const nodes = nodesRef.current[id];
    if (nodes && audioCtxRef.current) {
      nodes.gain.gain.linearRampToValueAtTime(value, audioCtxRef.current.currentTime + 0.1);
    }
  }, []);

  useEffect(() => {
    const currentNodes = nodesRef.current;
    const currentCtx = audioCtxRef.current;
    return () => {
      Object.values(currentNodes).forEach(nodes => {
        try { nodes.source.stop(); } catch (e) {}
        try { if (nodes.extraSource) nodes.extraSource.stop(); } catch (e) {}
        try { if (nodes.lfo) nodes.lfo.forEach(l => l.stop()); } catch (e) {}
      });
      try { if (currentCtx) currentCtx.close(); } catch (e) {}
    };
  }, []);

  return (
    <section id="music" className="py-24 px-4 relative overflow-hidden">
      <div className={`${theme.svgColor} opacity-30`}>
        <SectionBackground pattern="soundWave" position="center" size={800} spin="slow" />
        <SectionBackground pattern="spiral" position="topRight" size={450} spin="reverse" />
        <SectionBackground pattern="ripple" position="bottomLeft" size={400} spin="slow" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className={`section-title text-4xl md:text-6xl ${theme.text} mb-4`}>
            Zen soundscape
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xl font-body">
            Craft your sanctuary. Mix ambient textures with soulful melodies.
          </p>
        </div>

        {/* Dashboard Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* LEFT: Spotify / Main Melody */}
          <div className="flex-[1.2] glass-card rounded-3xl p-6 md:p-8 backdrop-blur-3xl border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className={`font-display text-2xl ${theme.text} italic`}>Soulful Melodies</h3>
              <div className="flex gap-2">
                <span className={`w-2 h-2 rounded-full ${theme.bg} animate-pulse`} />
                <span className={`w-2 h-2 rounded-full ${theme.bg} animate-pulse delay-75`} />
              </div>
            </div>
            
            <div className="rounded-2xl overflow-hidden shadow-inner bg-black/5 dark:bg-black/20">
               <iframe
                src="https://open.spotify.com/embed/playlist/7LI3zw8HLkjKo5YpvA26KG?utm_source=generator&theme=0"
                width="100%"
                height="450"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify Relaxing Playlist"
                className="opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

          {/* RIGHT: Ambient Mixer Dashboard */}
          <div className="flex-1 glass-card rounded-3xl p-6 md:p-8 backdrop-blur-3xl border border-white/10 shadow-2xl">
             <div className="flex items-center justify-between mb-8">
              <h3 className={`font-display text-2xl ${theme.text} italic`}>Ambient Textures</h3>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Natural Elements</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {soundConfigs.map((sound) => {
                const isActive = !!activeSounds[sound.id];
                return (
                  <div
                    key={sound.id}
                    className={`relative p-6 rounded-2xl transition-all duration-500 overflow-hidden ${
                      isActive 
                        ? `bg-white/10 dark:bg-white/5 border border-white/20 shadow-xl` 
                        : 'bg-transparent border border-transparent hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <button
                        onClick={() => toggleSound(sound)}
                        className={`w-14 h-14 rounded-2xl text-2xl flex items-center justify-center transition-all duration-500 ${
                          isActive
                            ? `${theme.bg} shadow-lg scale-110 rotate-3`
                            : 'bg-gray-100/50 dark:bg-gray-800/50 hover:bg-white/20'
                        }`}
                      >
                        {sound.emoji}
                      </button>
                      <div className="flex-1">
                        <h4 className={`font-medium font-body ${isActive ? theme.text : 'text-gray-400'}`}>
                          {sound.name}
                        </h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter">
                          {isActive ? 'Flowing' : 'Paused'}
                        </p>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volumes[sound.id]}
                      onChange={(e) => updateVolume(sound.id, parseFloat(e.target.value))}
                      className="ambient-slider w-full mb-2"
                      disabled={!isActive}
                      style={{ opacity: isActive ? 1 : 0.2 }}
                    />

                    {/* Animated Wave Indicator Spanning Bottom */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 flex items-end overflow-hidden opacity-30">
                         {Array.from({ length: 40 }).map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 ${theme.bg} animate-wave`}
                            style={{
                              height: `${Math.random() * 100}%`,
                              animationDelay: `${i * 0.05}s`,
                              animationDuration: `${0.5 + Math.random()}s`
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-black/5 dark:bg-white/5 text-center italic text-sm text-gray-500 font-body">
              &ldquo;Silence is the canvas, sound is the brush.&rdquo;
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MusicPlayer;
