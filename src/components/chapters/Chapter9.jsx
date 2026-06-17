import React, { useState, useRef } from 'react';

export default function Chapter9({ onComplete }) {
  const [digits, setDigits] = useState([0, 0, 0, 0]); // Thousands, Hundreds, Tens, Ones
  const wasCompleted = useRef(false);

  const handleDigitChange = (idx, increment) => {
    const nextDigits = [...digits];
    let nextVal = nextDigits[idx] + increment;
    if (nextVal > 9) nextVal = 0;
    if (nextVal < 0) nextVal = 9;
    nextDigits[idx] = nextVal;
    setDigits(nextDigits);

    const total = nextDigits[0]*1000 + nextDigits[1]*100 + nextDigits[2]*10 + nextDigits[3];
    const isComplete = total === 2048;
    if (isComplete !== wasCompleted.current) {
      wasCompleted.current = isComplete;
      onComplete(isComplete);
    }
  };

  const total = digits[0]*1000 + digits[1]*100 + digits[2]*10 + digits[3];

  return (
    <div className="lab-container flex-column" style={{gap: '2rem', alignItems: 'center'}}>
      <div className="flex-row" style={{gap: '1rem'}}>
        {['1000s', '100s', '10s', '1s'].map((place, idx) => (
          <div key={idx} className="glass-panel" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.75rem', minWidth: '70px'}}>
            <button className="btn btn-secondary" data-testid={`ch9-inc-${idx}`} style={{padding: '0.25rem 0.5rem'}} onClick={() => handleDigitChange(idx, 1)}>+</button>
            <div className="text-mono" data-testid={`ch9-digit-${idx}`} style={{fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'var(--color-cyan)'}}>{digits[idx]}</div>
            <button className="btn btn-secondary" data-testid={`ch9-dec-${idx}`} style={{padding: '0.25rem 0.5rem'}} onClick={() => handleDigitChange(idx, -1)}>-</button>
            <div style={{fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem'}}>{place}</div>
          </div>
        ))}
      </div>

      <div className="glass-card text-mono" style={{width: '100%', maxWidth: '450px', textAlign: 'center'}}>
        <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Expansion:</div>
        <div style={{fontSize: '1rem', color: 'white', margin: '0.5rem 0'}}>
          ({digits[0]} × 10³) + ({digits[1]} × 10²) + ({digits[2]} × 10¹) + ({digits[3]} × 10⁰)
        </div>
        <div style={{fontSize: '1rem', color: 'var(--text-secondary)', margin: '0.5rem 0'}}>
          {digits[0]*1000} + {digits[1]*100} + {digits[2]*10} + {digits[3]*1}
        </div>
        <div style={{borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', fontSize: '1.5rem', fontWeight: 'bold'}}>
          Total Value = <span data-testid="ch9-total-display" style={{color: 'var(--color-emerald)'}}>{total}</span>
        </div>
      </div>
    </div>
  );
}
