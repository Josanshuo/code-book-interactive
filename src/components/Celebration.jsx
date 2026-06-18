import React, { useMemo } from 'react';

/**
 * A lightweight confetti burst shown when a learner completes a challenge.
 * Renders a fixed, pointer-events-none overlay full of falling confetti
 * pieces with randomized colors, positions, and timing. Purely decorative.
 */
const CONFETTI_COLORS = [
  'var(--color-cyan)',
  'var(--color-emerald)',
  'var(--color-amber)',
  'var(--color-pink)',
  'var(--color-purple)',
];

const PIECE_COUNT = 36;

export default function Celebration() {
  // Compute random piece styles once per mount so they don't jump on re-render.
  const pieces = useMemo(() => {
    return Array.from({ length: PIECE_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      duration: 1.1 + Math.random() * 0.7,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 7 + Math.random() * 7,
      rotate: Math.random() * 360,
      drift: (Math.random() - 0.5) * 120,
    }));
  }, []);

  return (
    <div className="celebration-overlay" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.4}px`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--confetti-rotate': `${p.rotate}deg`,
            '--confetti-drift': `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
