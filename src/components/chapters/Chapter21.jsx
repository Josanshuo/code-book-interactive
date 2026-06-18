import React, { useState, useEffect, useRef } from 'react';

// --- CHAPTER 21: THE ARITHMETIC LOGIC UNIT (ALU) ---
// Kids flip bits like light switches instead of typing tricky binary strings.

const OPERATIONS = [
  { id: 'ADD', label: 'ADD ➕' },
  { id: 'SUB', label: 'SUB ➖' },
  { id: 'AND', label: 'AND' },
  { id: 'OR', label: 'OR' },
  { id: 'XOR', label: 'XOR' },
];

// A row of 8 clickable bit-switches for one operand.
function BitRow({ bits, color, onToggle, testIdPrefix }) {
  return (
    <div className="flex-row" style={{ gap: '0.35rem', justifyContent: 'center' }}>
      {bits.split('').map((b, i) => (
        <button
          key={i}
          className={`bit-cell ${b === '1' ? 'on' : ''}`}
          data-testid={`${testIdPrefix}-${i}`}
          style={{ background: b === '1' ? color : '#111827', color: b === '1' ? '#05202a' : 'white' }}
          onClick={() => onToggle(i)}
          aria-pressed={b === '1'}
        >
          {b}
        </button>
      ))}
    </div>
  );
}

export default function Chapter21({ onComplete }) {
  const [valA, setValA] = useState('10101010');
  const [valB, setValB] = useState('00001111');
  const [mode, setMode] = useState('ADD');

  const flipBit = (setter) => (i) =>
    setter((prev) => prev.substring(0, i) + (prev[i] === '1' ? '0' : '1') + prev.substring(i + 1));

  const getResult = () => {
    const numA = parseInt(valA, 2);
    const numB = parseInt(valB, 2);
    let res = 0;
    switch (mode) {
      case 'ADD': res = (numA + numB) & 0xFF; break;
      case 'SUB': res = (numA - numB) & 0xFF; break;
      case 'AND': res = (numA & numB) & 0xFF; break;
      case 'OR':  res = (numA | numB) & 0xFF; break;
      case 'XOR': res = (numA ^ numB) & 0xFF; break;
      default: res = 0;
    }
    return res.toString(2).padStart(8, '0');
  };

  const resultStr = getResult();

  const wasCompleted = useRef(false);
  useEffect(() => {
    // Challenge target: XOR of 10101010 and 00001111 = 10100101
    const isNowComplete = mode === 'XOR' && valA === '10101010' && valB === '00001111' && resultStr === '10100101';
    if (isNowComplete !== wasCompleted.current) {
      wasCompleted.current = isNowComplete;
      onComplete(isNowComplete);
    }
  }, [valA, valB, mode, resultStr, onComplete]);

  return (
    <div className="lab-container flex-column" style={{ gap: '1.25rem', alignItems: 'center' }}>
      <p className="kid-intro">
        The <strong>ALU</strong> is the calculator inside the CPU. Pick a job below, then
        <strong> flip the bit switches</strong> to feed it two numbers and watch the answer light up.
      </p>

      <div className="flex-row" style={{ gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {OPERATIONS.map((op) => (
          <button data-testid={`ch21-op-${op.id.toLowerCase()}`} key={op.id} className={`btn ${mode === op.id ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode(op.id)}>
            {op.label}
          </button>
        ))}
      </div>

      <div className="glass-panel flex-column" style={{ padding: '1rem', gap: '0.4rem', alignItems: 'center' }} data-testid="ch21-val-a">
        <label style={{ color: 'var(--color-cyan)', fontWeight: 700 }}>Number A = {parseInt(valA, 2)}</label>
        <BitRow bits={valA} color="var(--color-cyan)" onToggle={flipBit(setValA)} testIdPrefix="ch21-a-bit" />
      </div>

      <div className="glass-panel flex-column" style={{ padding: '1rem', gap: '0.4rem', alignItems: 'center' }} data-testid="ch21-val-b">
        <label style={{ color: 'var(--color-purple)', fontWeight: 700 }}>Number B = {parseInt(valB, 2)}</label>
        <BitRow bits={valB} color="var(--color-purple)" onToggle={flipBit(setValB)} testIdPrefix="ch21-b-bit" />
      </div>

      <div className="glass-card text-mono" data-testid="ch21-result" style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ALU Output (8-bit):</div>
        <div style={{ fontSize: '2rem', color: 'var(--color-pink)', fontWeight: 'bold', margin: '0.5rem 0' }}>{resultStr}</div>
        <div style={{ fontSize: '1rem', color: 'var(--color-emerald)' }}>= {parseInt(resultStr, 2)} (Decimal)</div>
      </div>
    </div>
  );
}
