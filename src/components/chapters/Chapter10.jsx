import React, { useState, useRef, useEffect } from 'react';
import DisplayCard from '../shared/DisplayCard';

// Bulb place-values, most-significant first (powers of two).
const BULBS = [32, 16, 8, 4, 2, 1];

export default function Chapter10({ onComplete }) {
  const [decInput, setDecInput] = useState('');
  const wasCompleted = useRef(false);

  // decInput (a string) is the single source of truth so the bulbs and the
  // number box always agree. The challenge check lives in one effect.
  useEffect(() => {
    const isComplete = parseInt(decInput, 10) === 42; // binary 101010
    if (isComplete !== wasCompleted.current) {
      wasCompleted.current = isComplete;
      onComplete(isComplete);
    }
  }, [decInput, onComplete]);

  const handleInputChange = (e) => setDecInput(e.target.value);

  const numValue = (() => {
    const n = parseInt(decInput, 10);
    return isNaN(n) ? 0 : n;
  })();

  const toggleBulb = (place) => {
    // Functional update so rapid clicks each see the latest value, not a
    // stale render-scope copy. Flip this bulb's bit within our 6-bulb range.
    setDecInput((prev) => {
      const cur = parseInt(prev, 10) || 0;
      return String((cur ^ place) & 0b111111);
    });
  };

  const getOctal = () => (isNaN(parseInt(decInput, 10)) ? '' : numValue.toString(8));
  const getBinary = () => (isNaN(parseInt(decInput, 10)) ? '' : numValue.toString(2));

  return (
    <div className="lab-container flex-column" style={{ gap: '1.5rem', alignItems: 'center' }}>
      <p className="kid-intro">
        Imagine you only had <strong>2 fingers</strong> instead of 10! Each light bulb is
        worth double the one to its right. Switch bulbs on to build a number — can you make <strong>42</strong>?
      </p>

      {/* Clickable binary bulbs */}
      <div className="bulb-row">
        {BULBS.map((place) => {
          const on = (numValue & place) !== 0;
          return (
            <button
              key={place}
              className={`bulb ${on ? 'on' : ''}`}
              data-testid={`ch10-bulb-${place}`}
              onClick={() => toggleBulb(place)}
              aria-pressed={on}
              aria-label={`Bulb worth ${place}, ${on ? 'on' : 'off'}`}
            >
              <span className="bulb-glass">{on ? '💡' : ''}</span>
              <span className="bulb-value">{place}</span>
              <span className="bulb-bit">{on ? 1 : 0}</span>
            </button>
          );
        })}
      </div>

      <div className="glass-panel" style={{ padding: '1.25rem', width: '100%', maxWidth: '400px' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>…or just type a decimal number:</label>
        <input
          type="number"
          className="btn btn-secondary"
          data-testid="ch10-decimal-input"
          style={{ background: '#090d16', border: '1px solid #1f2937', padding: '0.75rem 1rem', width: '100%', color: 'white', textAlign: 'center', fontSize: '1.2rem' }}
          placeholder="Enter a decimal number..."
          value={decInput}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid-2" style={{ width: '100%', maxWidth: '400px' }}>
        <DisplayCard label="Octal (Base 8)" value={getOctal() || '-'} color="var(--color-amber)" fontSize="1.5rem" testId="ch10-octal-display" />
        <DisplayCard label="Binary (Base 2)" value={getBinary() || '-'} color="var(--color-cyan)" fontSize="1.5rem" testId="ch10-binary-display" />
      </div>
    </div>
  );
}
