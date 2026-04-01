import React from 'react';

/*
 * Unique decorative SVG backgrounds for each section.
 * Each pattern is different — sacred geometry, mandalas, lotuses, spirals, etc.
 * They float, rotate, and glow subtly to create a dreamy atmosphere.
 */

/* ── Pattern: Lotus Flower ── */
const LotusPattern = ({ className = '' }) => {
  const petals = 12;
  return (
    <svg viewBox="0 0 400 400" className={className} fill="currentColor">
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (360 / petals) * i;
        const rad = (angle * Math.PI) / 180;
        const cx = 200 + Math.cos(rad) * 80;
        const cy = 200 + Math.sin(rad) * 80;
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={18}
            ry={55}
            transform={`rotate(${angle + 90}, ${cx}, ${cy})`}
            opacity="0.12"
          />
        );
      })}
      {/* Inner ring of smaller petals */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (360 / 8) * i + 22.5;
        const rad = (angle * Math.PI) / 180;
        const cx = 200 + Math.cos(rad) * 40;
        const cy = 200 + Math.sin(rad) * 40;
        return (
          <ellipse
            key={`inner-${i}`}
            cx={cx}
            cy={cy}
            rx={10}
            ry={30}
            transform={`rotate(${angle + 90}, ${cx}, ${cy})`}
            opacity="0.15"
          />
        );
      })}
      <circle cx="200" cy="200" r="15" opacity="0.2" />
      <circle cx="200" cy="200" r="8" opacity="0.25" />
    </svg>
  );
};

/* ── Pattern: Flower of Life (Sacred Geometry) ── */
const FlowerOfLifePattern = ({ className = '' }) => (
  <svg viewBox="0 0 400 400" className={className} fill="none" stroke="currentColor">
    {/* Central circle */}
    <circle cx="200" cy="200" r="50" strokeWidth="0.5" opacity="0.12" />
    {/* 6 surrounding circles */}
    {Array.from({ length: 6 }).map((_, i) => {
      const angle = (360 / 6) * i;
      const rad = (angle * Math.PI) / 180;
      return (
        <circle
          key={i}
          cx={200 + Math.cos(rad) * 50}
          cy={200 + Math.sin(rad) * 50}
          r="50"
          strokeWidth="0.5"
          opacity="0.1"
        />
      );
    })}
    {/* Outer ring of 12 circles */}
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (360 / 12) * i;
      const rad = (angle * Math.PI) / 180;
      return (
        <circle
          key={`outer-${i}`}
          cx={200 + Math.cos(rad) * 100}
          cy={200 + Math.sin(rad) * 100}
          r="50"
          strokeWidth="0.3"
          opacity="0.07"
        />
      );
    })}
    {/* Containment circle */}
    <circle cx="200" cy="200" r="150" strokeWidth="0.3" opacity="0.06" />
    <circle cx="200" cy="200" r="155" strokeWidth="0.2" opacity="0.04" />
  </svg>
);

/* ── Pattern: Spiral Galaxy ── */
const SpiralPattern = ({ className = '' }) => {
  const spiralPoints = [];
  for (let i = 0; i < 200; i++) {
    const angle = (i / 200) * Math.PI * 6;
    const r = (i / 200) * 150;
    const x = 200 + Math.cos(angle) * r;
    const y = 200 + Math.sin(angle) * r;
    spiralPoints.push(`${i === 0 ? 'M' : 'L'}${x},${y}`);
  }
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" stroke="currentColor">
      <path d={spiralPoints.join(' ')} strokeWidth="0.8" opacity="0.08" />
      {/* Scattered dots along spiral */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (i / 30) * Math.PI * 6;
        const r = (i / 30) * 140;
        return (
          <circle
            key={i}
            cx={200 + Math.cos(angle) * r}
            cy={200 + Math.sin(angle) * r}
            r={1 + Math.random() * 2}
            fill="currentColor"
            opacity={0.05 + (i / 30) * 0.1}
          />
        );
      })}
    </svg>
  );
};

/* ── Pattern: Concentric Ripples ── */
const RipplePattern = ({ className = '' }) => (
  <svg viewBox="0 0 400 400" className={className} fill="none" stroke="currentColor">
    {Array.from({ length: 8 }).map((_, i) => (
      <circle
        key={i}
        cx="200"
        cy="200"
        r={20 + i * 22}
        strokeWidth={0.8 - i * 0.08}
        opacity={0.15 - i * 0.015}
        strokeDasharray={i % 2 === 0 ? "none" : `${4 + i * 2} ${3 + i}`}
      />
    ))}
    {/* Small decorative dots at cardinal points */}
    {Array.from({ length: 16 }).map((_, i) => {
      const angle = (360 / 16) * i;
      const rad = (angle * Math.PI) / 180;
      const r = 60 + (i % 3) * 50;
      return (
        <circle
          key={`dot-${i}`}
          cx={200 + Math.cos(rad) * r}
          cy={200 + Math.sin(rad) * r}
          r="2"
          fill="currentColor"
          opacity="0.12"
        />
      );
    })}
  </svg>
);

/* ── Pattern: Star Burst / Seed of Life ── */
const StarBurstPattern = ({ className = '' }) => (
  <svg viewBox="0 0 400 400" className={className} fill="currentColor">
    {/* Radiating lines */}
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (360 / 24) * i;
      const rad = (angle * Math.PI) / 180;
      const len = i % 2 === 0 ? 160 : 100;
      return (
        <line
          key={i}
          x1="200"
          y1="200"
          x2={200 + Math.cos(rad) * len}
          y2={200 + Math.sin(rad) * len}
          stroke="currentColor"
          strokeWidth={i % 2 === 0 ? "0.5" : "0.3"}
          opacity={i % 2 === 0 ? "0.08" : "0.05"}
        />
      );
    })}
    {/* Diamond shapes at tips */}
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (360 / 12) * i;
      const rad = (angle * Math.PI) / 180;
      const cx = 200 + Math.cos(rad) * 130;
      const cy = 200 + Math.sin(rad) * 130;
      return (
        <polygon
          key={`d-${i}`}
          points={`${cx},${cy - 6} ${cx + 4},${cy} ${cx},${cy + 6} ${cx - 4},${cy}`}
          transform={`rotate(${angle}, ${cx}, ${cy})`}
          opacity="0.1"
        />
      );
    })}
    <circle cx="200" cy="200" r="10" opacity="0.1" />
  </svg>
);

/* ── Pattern: Flowing Vine / Infinity ── */
const VinePattern = ({ className = '' }) => {
  // Create flowing figure-8 / infinity paths
  const points1 = [];
  const points2 = [];
  for (let i = 0; i <= 200; i++) {
    const t = (i / 200) * Math.PI * 2;
    // Lissajous curve (figure-8 shape)
    const x1 = 200 + Math.sin(t * 2) * 120;
    const y1 = 200 + Math.sin(t * 3) * 100;
    const x2 = 200 + Math.cos(t * 2) * 100;
    const y2 = 200 + Math.cos(t * 3 + 1) * 120;
    points1.push(`${i === 0 ? 'M' : 'L'}${x1},${y1}`);
    points2.push(`${i === 0 ? 'M' : 'L'}${x2},${y2}`);
  }
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" stroke="currentColor">
      <path d={points1.join(' ')} strokeWidth="0.8" opacity="0.08" />
      <path d={points2.join(' ')} strokeWidth="0.5" opacity="0.06" />
      {/* Small blooms along the vine */}
      {Array.from({ length: 8 }).map((_, i) => {
        const t = (i / 8) * Math.PI * 2;
        const cx = 200 + Math.sin(t * 2) * 120;
        const cy = 200 + Math.sin(t * 3) * 100;
        return (
          <g key={i}>
            {Array.from({ length: 5 }).map((_, j) => {
              const a = (360 / 5) * j;
              const r = (a * Math.PI) / 180;
              return (
                <ellipse
                  key={j}
                  cx={cx + Math.cos(r) * 6}
                  cy={cy + Math.sin(r) * 6}
                  rx="2"
                  ry="6"
                  transform={`rotate(${a + 90}, ${cx + Math.cos(r) * 6}, ${cy + Math.sin(r) * 6})`}
                  fill="currentColor"
                  opacity="0.08"
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

/* ── Pattern: Sound Wave Mandala ── */
const SoundWavePattern = ({ className = '' }) => (
  <svg viewBox="0 0 400 400" className={className} fill="none" stroke="currentColor">
    {/* Concentric sound rings with varying amplitude */}
    {Array.from({ length: 6 }).map((_, ring) => {
      const r = 40 + ring * 25;
      const segments = 48;
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const wobble = Math.sin(angle * (3 + ring)) * (3 + ring * 2);
        const px = 200 + Math.cos(angle) * (r + wobble);
        const py = 200 + Math.sin(angle) * (r + wobble);
        points.push(`${i === 0 ? 'M' : 'L'}${px},${py}`);
      }
      return (
        <path
          key={ring}
          d={points.join(' ') + 'Z'}
          strokeWidth="0.5"
          opacity={0.12 - ring * 0.015}
        />
      );
    })}
    {/* Musical note dots */}
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (360 / 8) * i + 22.5;
      const rad = (angle * Math.PI) / 180;
      return (
        <circle
          key={`note-${i}`}
          cx={200 + Math.cos(rad) * 155}
          cy={200 + Math.sin(rad) * 155}
          r="3"
          fill="currentColor"
          opacity="0.1"
        />
      );
    })}
  </svg>
);

/* ── The main background component ── */
const patterns = {
  lotus: LotusPattern,
  flowerOfLife: FlowerOfLifePattern,
  spiral: SpiralPattern,
  ripple: RipplePattern,
  starBurst: StarBurstPattern,
  vine: VinePattern,
  soundWave: SoundWavePattern,
};

const SectionBackground = ({
  pattern = 'lotus',
  position = 'center',   // 'center', 'left', 'right', 'topRight', 'bottomLeft'
  size = 600,
  spin = 'slower',        // 'slow', 'slower', 'reverse', false
  opacity = 0.4,
  blur = false,
}) => {
  const PatternComponent = patterns[pattern];
  if (!PatternComponent) return null;

  const positionStyles = {
    center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
    left: 'left-0 top-1/2 -translate-x-1/3 -translate-y-1/2',
    right: 'right-0 top-1/2 translate-x-1/3 -translate-y-1/2',
    topRight: 'right-0 top-0 translate-x-1/4 -translate-y-1/4',
    bottomLeft: 'left-0 bottom-0 -translate-x-1/4 translate-y-1/4',
    topLeft: 'left-0 top-0 -translate-x-1/4 -translate-y-1/4',
  };

  const spinClass = spin === 'slow' ? 'animate-spin-slow'
    : spin === 'slower' ? 'animate-spin-slower'
    : spin === 'reverse' ? 'animate-spin-reverse'
    : '';

  return (
    <div
      className={`absolute ${positionStyles[position] || positionStyles.center} pointer-events-none z-0`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <PatternComponent
        className={`w-full h-full text-current ${spinClass} ${blur ? 'blur-[1px]' : ''}`}
        style={{ opacity }}
      />
    </div>
  );
};

export default SectionBackground;
export { LotusPattern, FlowerOfLifePattern, SpiralPattern, RipplePattern, StarBurstPattern, VinePattern, SoundWavePattern };
