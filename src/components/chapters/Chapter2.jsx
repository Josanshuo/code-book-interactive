import React, { useState, useMemo } from 'react';
import { generateCombinations } from '../../utils/binaryUtils';

export default function Chapter2({ onComplete }) {
  const [bits, setBits] = useState(3);
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const totalCombinations = Math.pow(2, bits);
  
  const combinations = useMemo(() => generateCombinations(bits), [bits]);

  const handleCheck = (e) => {
    e.preventDefault();
    if (parseInt(inputVal, 10) === 32 && bits === 5) {
      onComplete(true);
      setErrorMsg('');
    } else if (bits !== 5) {
      setErrorMsg("Please adjust the bit slider to 5 first!");
    } else {
      setErrorMsg("Incorrect combination count. Try again!");
    }
  };

  return (
    <div className="lab-container">
      <div className="flex-column" style={{gap: '1.5rem'}}>
        <div className="glass-card">
          <label style={{display: 'flex', justifyContent: 'between', alignItems: 'center', width: '100%', marginBottom: '0.5rem'}}>
            <span>Number of Signals (Bits): <strong style={{color: 'var(--color-cyan)', fontSize: '1.2rem'}}>{bits}</strong></span>
          </label>
          <input 
            type="range" 
            min="1" 
            max="6" 
            value={bits} 
            data-testid="ch2-bits-slider"
            onChange={(e) => {
              setBits(parseInt(e.target.value, 10));
              onComplete(false);
            }} 
            style={{width: '100%', accentColor: 'var(--color-cyan)'}} 
          />
        </div>

        <div className="glass-card">
          <div style={{marginBottom: '0.5rem', fontWeight: 600}}>All Possible Combinations (Total: {totalCombinations}):</div>
          <div data-testid="ch2-combinations-grid" style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontFamily: 'var(--font-mono)'}}>
            {combinations.map((combo, idx) => (
              <span key={idx} style={{
                background: 'rgba(0,242,254,0.1)', 
                color: 'var(--color-cyan)', 
                padding: '0.2rem 0.5rem', 
                borderRadius: '4px',
                border: '1px solid rgba(0,242,254,0.2)'
              }}>{combo}</span>
            ))}
          </div>
        </div>

        <form onSubmit={handleCheck} className="flex-row" style={{alignItems: 'center', gap: '1rem'}}>
          <input 
            type="number" 
            className="btn btn-secondary" 
            placeholder="Enter total combinations..." 
            value={inputVal}
            data-testid="ch2-answer-input"
            onChange={(e) => setInputVal(e.target.value)}
            style={{background: '#111827', border: '1px solid #374151', padding: '0.6rem 1rem', width: '220px'}}
          />
          <button type="submit" className="btn btn-primary" data-testid="ch2-check-btn">Check Answer</button>
        </form>
        {errorMsg && <div style={{color: 'var(--color-ruby)', fontWeight: 600}}>{errorMsg}</div>}
      </div>
    </div>
  );
}
