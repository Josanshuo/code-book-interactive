import React, { useState, useRef, useEffect } from 'react';

const TARGET = 2026; // a number kids recognize: this year!
const PLACES = ['1000s', '100s', '10s', '1s'];

export default function Chapter9({ onComplete }) {
  const [digits, setDigits] = useState([0, 0, 0, 0]); // Thousands, Hundreds, Tens, Ones
  const wasCompleted = useRef(false);

  // Functional update so rapid clicks each see the latest digit (no clobber).
  const handleDigitChange = (idx, increment) => {
    setDigits((prev) => {
      const next = [...prev];
      let v = next[idx] + increment;
      if (v > 9) v = 0;
      if (v < 0) v = 9;
      next[idx] = v;
      return next;
    });
  };

  const total = digits[0] * 1000 + digits[1] * 100 + digits[2] * 10 + digits[3];

  useEffect(() => {
    const isComplete = total === TARGET;
    if (isComplete !== wasCompleted.current) {
      wasCompleted.current = isComplete;
      onComplete(isComplete);
    }
  }, [total, onComplete]);

  return (
    <div className="lab-container flex-column" style={{ gap: '1.5rem', alignItems: 'center' }}>
      <p className="kid-intro">
        Each spot is worth <strong>10 times</strong> the one to its right. Stack up the
        digits to show the current year: <strong>{TARGET}</strong>.
      </p>

      <div className="flex-row" style={{ gap: '1rem' }}>
        {PLACES.map((place, idx) => (
          <div key={idx} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.75rem', minWidth: '76px' }}>
            <button className="btn btn-secondary" data-testid={`ch9-inc-${idx}`} style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleDigitChange(idx, 1)}>+</button>
            <div className="text-mono" data-testid={`ch9-digit-${idx}`} style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'var(--color-cyan)' }}>{digits[idx]}</div>
            <button className="btn btn-secondary" data-testid={`ch9-dec-${idx}`} style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleDigitChange(idx, -1)}>-</button>
            {/* Coin stack: one coin per count, so place value is something you can SEE */}
            <div className="coin-stack" aria-hidden="true">
              {Array.from({ length: digits[idx] }, (_, i) => (
                <span key={i} className="coin" />
              ))}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{place}</div>
          </div>
        ))}
      </div>

      <div className="glass-card text-mono" style={{ width: '100%', maxWidth: '450px', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Expansion:</div>
        <div style={{ fontSize: '1rem', color: 'white', margin: '0.5rem 0' }}>
          ({digits[0]} × 10³) + ({digits[1]} × 10²) + ({digits[2]} × 10¹) + ({digits[3]} × 10⁰)
        </div>
        <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: '0.5rem 0' }}>
          {digits[0] * 1000} + {digits[1] * 100} + {digits[2] * 10} + {digits[3] * 1}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Total Value = <span data-testid="ch9-total-display" style={{ color: total === TARGET ? 'var(--color-emerald)' : 'var(--color-amber)' }}>{total}</span>
        </div>
      </div>
    </div>
  );
}
