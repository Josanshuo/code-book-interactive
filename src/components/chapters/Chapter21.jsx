import React, { useState, useEffect, useRef } from 'react';

// --- CHAPTER 21: THE ARITHMETIC LOGIC UNIT (ALU) ---
export default function Chapter21({ onComplete }) {
  const [valA, setValA] = useState('10101010'); // binary A
  const [valB, setValB] = useState('00001111'); // binary B
  const [mode, setMode] = useState('ADD');

  const operations = ['ADD', 'SUB', 'AND', 'OR', 'XOR'];

  const getResult = () => {
    const numA = parseInt(valA, 2);
    const numB = parseInt(valB, 2);
    let res = 0;
    switch(mode) {
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
    // Challenge target: XOR mode, valA = 10101010, valB = 00001111, resultStr = 10100101
    const isNowComplete = mode === 'XOR' && valA === '10101010' && valB === '00001111' && resultStr === '10100101';
    if (isNowComplete !== wasCompleted.current) {
      wasCompleted.current = isNowComplete;
      onComplete(isNowComplete);
    }
  }, [valA, valB, mode, resultStr, onComplete]);

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <div className="flex-row" style={{gap: '0.5rem', flexWrap: 'wrap'}}>
        {operations.map(op => (
          <button data-testid={`ch21-op-${op.toLowerCase()}`} key={op} className={`btn ${mode === op ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode(op)}>
            {op}
          </button>
        ))}
      </div>

      <div className="grid-2" style={{width: '100%', maxWidth: '500px'}}>
        <div className="glass-panel flex-column" style={{padding: '1rem'}}>
          <label>Operand A (8-bit binary):</label>
          <input 
            data-testid="ch21-val-a"
            type="text" 
            className="btn btn-secondary text-mono" 
            value={valA} 
            onChange={(e) => setValA(e.target.value.replace(/[^01]/g, '').slice(0, 8))} 
          />
        </div>
        <div className="glass-panel flex-column" style={{padding: '1rem'}}>
          <label>Operand B (8-bit binary):</label>
          <input 
            data-testid="ch21-val-b"
            type="text" 
            className="btn btn-secondary text-mono" 
            value={valB} 
            onChange={(e) => setValB(e.target.value.replace(/[^01]/g, '').slice(0, 8))} 
          />
        </div>
      </div>

      <div className="glass-card text-mono" data-testid="ch21-result" style={{width: '100%', maxWidth: '500px', textAlign: 'center'}}>
        <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>ALU Output (8-bit):</div>
        <div style={{fontSize: '2rem', color: 'var(--color-pink)', fontWeight: 'bold', margin: '0.5rem 0'}}>{resultStr}</div>
        <div style={{fontSize: '1rem', color: 'var(--color-emerald)'}}>= {parseInt(resultStr, 2)} (Decimal)</div>
      </div>
    </div>
  );
}
