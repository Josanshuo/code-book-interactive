import React, { useState, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

// Braille character dictionary mapping dots key to letter
// Key format: string of raised dot indices, e.g. "1,4" for C
const BRAILLE_TO_CHAR = {
  "1": "A", "1,2": "B", "1,4": "C", "1,4,5": "D", "1,5": "E",
  "1,2,4": "F", "1,2,4,5": "G", "1,2,5": "H", "2,4": "I", "2,4,5": "J",
  "1,3": "K", "1,2,3": "L", "1,3,4": "M", "1,3,4,5": "N", "1,3,5": "O",
  "1,2,3,4": "P", "1,2,3,4,5": "Q", "1,2,3,5": "R", "2,3,4": "S", "2,3,4,5": "T",
  "1,3,6": "U", "1,2,3,6": "V", "2,4,5,6": "W", "1,3,4,6": "X", "1,3,4,5,6": "Y",
  "1,3,5,6": "Z"
};

// Reverse lookup: letter -> set of raised dot numbers, e.g. "C" -> {1,4}.
const CHAR_TO_DOTS = Object.fromEntries(
  Object.entries(BRAILLE_TO_CHAR).map(([dots, char]) => [
    char,
    new Set(dots.split(',').map(Number)),
  ])
);

// Grid fills row-by-row, so render dots in visual order: 1,4 / 2,5 / 3,6.
const MINI_ORDER = [1, 4, 2, 5, 3, 6];

export default function Chapter3({ onComplete }) {
  const [dots, setDots] = useState([false, false, false, false, false, false]); // Dot 1 to 6 (1-based index 1-6)
  const [name, setName] = useState('');
  const wasCompleted = useRef(false);

  const toggleDot = (idx) => {
    const nextDots = [...dots];
    nextDots[idx] = !nextDots[idx];
    setDots(nextDots);

    // Get list of active dots (1-based index)
    const active = [];
    nextDots.forEach((val, i) => {
      if (val) active.push(i + 1);
    });
    const key = active.join(",");
    
    // Check challenge: Letter C is dots 1 and 4
    const isComplete = key === "1,4";
    if (isComplete !== wasCompleted.current) {
      wasCompleted.current = isComplete;
      onComplete(isComplete);
    }
  };

  const getActiveCharacter = () => {
    const active = [];
    dots.forEach((val, i) => {
      if (val) active.push(i + 1);
    });
    return BRAILLE_TO_CHAR[active.join(",")] || "?";
  };

  const resetLab = () => {
    setDots([false, false, false, false, false, false]);
    if (wasCompleted.current) {
      wasCompleted.current = false;
      onComplete(false);
    }
  };

  return (
    <div className="lab-container flex-column" style={{alignItems: 'center', justifyContent: 'center', gap: '2rem'}}>
      <div className="braille-grid">
        <button className={`braille-dot ${dots[0] ? 'active' : ''}`} onClick={() => toggleDot(0)} title="Dot 1" data-testid="ch3-dot-1"></button>
        <button className={`braille-dot ${dots[3] ? 'active' : ''}`} onClick={() => toggleDot(3)} title="Dot 4" data-testid="ch3-dot-4"></button>
        <button className={`braille-dot ${dots[1] ? 'active' : ''}`} onClick={() => toggleDot(1)} title="Dot 2" data-testid="ch3-dot-2"></button>
        <button className={`braille-dot ${dots[4] ? 'active' : ''}`} onClick={() => toggleDot(4)} title="Dot 5" data-testid="ch3-dot-5"></button>
        <button className={`braille-dot ${dots[2] ? 'active' : ''}`} onClick={() => toggleDot(2)} title="Dot 3" data-testid="ch3-dot-3"></button>
        <button className={`braille-dot ${dots[5] ? 'active' : ''}`} onClick={() => toggleDot(5)} title="Dot 6" data-testid="ch3-dot-6"></button>
      </div>

      <div className="glass-card text-mono" style={{textAlign: 'center', minWidth: '300px'}}>
        <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Raised Dots: {dots.map((val, i) => val ? i + 1 : null).filter(Boolean).join(", ") || "None"}</div>
        <div data-testid="ch3-letter-display" style={{fontSize: '2rem', color: 'var(--color-cyan)', fontWeight: 'bold', marginTop: '0.5rem'}}>Letter: {getActiveCharacter()}</div>
      </div>
      <button className="btn btn-secondary" data-testid="ch3-clear-btn" onClick={resetLab}><RotateCcw size={16} /> Clear</button>

      {/* Spell-your-name mode: type letters and see them in Braille */}
      <div className="glass-panel flex-column" style={{ padding: '1rem', gap: '0.75rem', alignItems: 'center', width: '100%', maxWidth: '420px' }}>
        <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>✨ Type your name to see it in Braille:</label>
        <input
          type="text"
          data-testid="ch3-name-input"
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase().replace(/[^A-Z ]/g, '').slice(0, 12))}
          placeholder="e.g. SAM"
          className="btn btn-secondary text-mono"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          spellCheck={false}
          style={{ textAlign: 'center', letterSpacing: '0.15em', width: '100%' }}
        />
        {name.trim() && (
          <div className="braille-name-row" data-testid="ch3-name-braille">
            {name.split('').map((ch, i) => {
              if (ch === ' ') return <div key={i} style={{ width: '14px' }} />;
              const raised = CHAR_TO_DOTS[ch] || new Set();
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div className="braille-mini">
                    {MINI_ORDER.map((dotNum) => (
                      <span key={dotNum} className={`braille-mini-dot ${raised.has(dotNum) ? 'on' : ''}`} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{ch}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
