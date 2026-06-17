import React, { useState, useRef } from 'react';
import DisplayCard from '../shared/DisplayCard';

export default function Chapter12({ onComplete }) {
  const [byte, setByte] = useState([0,0,0,0,0,0,0,0]);
  const wasCompleted = useRef(false);

  const toggleBit = (idx) => {
    const nextByte = [...byte];
    nextByte[idx] = nextByte[idx] ? 0 : 1;
    setByte(nextByte);

    // Check challenge: Hex A5 = binary 10100101 = decimal 165
    const val = parseInt(nextByte.join(''), 2);
    const isComplete = val === 165;
    if (isComplete !== wasCompleted.current) {
      wasCompleted.current = isComplete;
      onComplete(isComplete);
    }
  };

  const getHexValue = () => {
    const highNibble = parseInt(byte.slice(0, 4).join(''), 2).toString(16).toUpperCase();
    const lowNibble = parseInt(byte.slice(4, 8).join(''), 2).toString(16).toUpperCase();
    return highNibble + lowNibble;
  };

  const getDecimalValue = () => {
    return parseInt(byte.join(''), 2);
  };

  const handleSetHexChallenge = () => {
    // Quick helper to auto-complete or let them set it
    setByte([1,0,1,0,0,1,0,1]); // Set A5
    if (!wasCompleted.current) {
      wasCompleted.current = true;
      onComplete(true);
    }
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      {/* 8 Bits togglers grouped in nibbles */}
      <div className="flex-row" style={{gap: '2rem'}}>
        {/* High Nibble */}
        <div className="glass-panel flex-column" style={{padding: '1rem', alignItems: 'center', borderColor: 'var(--color-purple)'}}>
          <div style={{fontSize: '0.75rem', color: 'var(--color-purple)', fontWeight: 700}}>HIGH NIBBLE</div>
          <div className="flex-row" style={{gap: '0.4rem'}}>
            {[0,1,2,3].map(idx => (
              <button 
                key={idx} 
                className="text-mono" 
                data-testid={`ch12-bit-${idx}`}
                style={{
                  width: '32px', 
                  height: '32px', 
                  background: byte[idx] ? 'var(--color-purple)' : '#111827', 
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onClick={() => toggleBit(idx)}
              >
                {byte[idx]}
              </button>
            ))}
          </div>
        </div>

        {/* Low Nibble */}
        <div className="glass-panel flex-column" style={{padding: '1rem', alignItems: 'center', borderColor: 'var(--color-cyan)'}}>
          <div style={{fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 700}}>LOW NIBBLE</div>
          <div className="flex-row" style={{gap: '0.4rem'}}>
            {[4,5,6,7].map(idx => (
              <button 
                key={idx} 
                className="text-mono" 
                data-testid={`ch12-bit-${idx}`}
                style={{
                  width: '32px', 
                  height: '32px', 
                  background: byte[idx] ? 'var(--color-cyan)' : '#111827', 
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onClick={() => toggleBit(idx)}
              >
                {byte[idx]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-3" style={{width: '100%', maxWidth: '500px'}}>
        <DisplayCard label="Hexadecimal" value={`0x${getHexValue()}`} color="var(--color-pink)" testId="ch12-hex-display" />
        <DisplayCard label="Unsigned Dec" value={getDecimalValue()} color="var(--color-emerald)" testId="ch12-dec-display" />
        <DisplayCard label="Signed (2's)" value={getDecimalValue() >= 128 ? getDecimalValue() - 256 : getDecimalValue()} color="var(--color-amber)" testId="ch12-signed-display" />
      </div>

      <button className="btn btn-secondary" data-testid="ch12-solve-btn" onClick={handleSetHexChallenge}>Solve Instantly (Set A5)</button>
    </div>
  );
}
