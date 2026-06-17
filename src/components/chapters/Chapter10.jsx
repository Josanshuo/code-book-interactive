import React, { useState, useRef } from 'react';
import DisplayCard from '../shared/DisplayCard';

export default function Chapter10({ onComplete }) {
  const [decInput, setDecInput] = useState('');
  const wasCompleted = useRef(false);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setDecInput(val);
    const parsed = parseInt(val, 10);
    
    // Challenge target binary '101010' = 42 decimal
    const isComplete = parsed === 42;
    if (isComplete !== wasCompleted.current) {
      wasCompleted.current = isComplete;
      onComplete(isComplete);
    }
  };

  const getOctal = () => {
    const num = parseInt(decInput, 10);
    return isNaN(num) ? '' : num.toString(8);
  };

  const getBinary = () => {
    const num = parseInt(decInput, 10);
    return isNaN(num) ? '' : num.toString(2);
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <div className="glass-panel" style={{padding: '1.5rem', width: '100%', maxWidth: '400px'}}>
        <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600}}>Decimal (Base 10) Input:</label>
        <input 
          type="number" 
          className="btn btn-secondary" 
          data-testid="ch10-decimal-input"
          style={{background: '#090d16', border: '1px solid #1f2937', padding: '0.75rem 1rem', width: '100%', color: 'white', textAlign: 'center', fontSize: '1.2rem'}}
          placeholder="Enter a decimal number..." 
          value={decInput}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid-2" style={{width: '100%', maxWidth: '400px'}}>
        <DisplayCard label="Octal (Base 8)" value={getOctal() || '-'} color="var(--color-amber)" fontSize="1.5rem" testId="ch10-octal-display" />
        <DisplayCard label="Binary (Base 2)" value={getBinary() || '-'} color="var(--color-cyan)" fontSize="1.5rem" testId="ch10-binary-display" />
      </div>
    </div>
  );
}
