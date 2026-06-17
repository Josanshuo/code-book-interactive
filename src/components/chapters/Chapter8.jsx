import React, { useState, useEffect, useRef } from 'react';
import ToggleSwitch from '../shared/ToggleSwitch';

export default function Chapter8({ onComplete }) {
  const [gateType, setGateType] = useState('XOR');
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  const wasCompleted = useRef(false);

  const getOutput = () => {
    switch(gateType) {
      case 'NOT': return !inputA;
      case 'AND': return inputA && inputB;
      case 'OR':  return inputA || inputB;
      case 'NAND': return !(inputA && inputB);
      case 'NOR':  return !(inputA || inputB);
      case 'XOR':  return inputA !== inputB;
      default: return false;
    }
  };

  const output = getOutput();

  useEffect(() => {
    // Challenge is for XOR: find input combination that outputs 1.
    // e.g. A=1, B=0 or A=0, B=1.
    const isNowComplete = gateType === 'XOR' && output;
    if (isNowComplete !== wasCompleted.current) {
      wasCompleted.current = isNowComplete;
      onComplete(isNowComplete);
    }
  }, [gateType, inputA, inputB, output, onComplete]);

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem'}}>
      <div className="flex-row" style={{justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap'}}>
        {['NOT', 'AND', 'OR', 'NAND', 'NOR', 'XOR'].map((type) => (
          <button 
            key={type}
            className={`btn ${gateType === type ? 'btn-primary' : 'btn-secondary'}`}
            data-testid={`ch8-gate-${type.toLowerCase()}`}
            onClick={() => {
              setGateType(type);
              setInputA(false);
              setInputB(false);
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex-row" style={{justifyContent: 'center', gap: '2rem'}}>
        <ToggleSwitch label="Input A" value={inputA} onChange={setInputA} testId="ch8-input-a" />
        {gateType !== 'NOT' && (
          <ToggleSwitch label="Input B" value={inputB} onChange={setInputB} testId="ch8-input-b" />
        )}
      </div>

      <div className="flex-column" style={{alignItems: 'center'}}>
        <div className="glass-card text-mono" style={{textAlign: 'center', width: '300px'}}>
          <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Logic Symbol Representation:</div>
          <div style={{fontSize: '1.5rem', margin: '1rem 0', color: 'var(--color-pink)', fontWeight: 'bold'}}>
            {gateType === 'NOT' ? `NOT ${inputA ? '1' : '0'}` : `${inputA ? '1' : '0'} ${gateType} ${inputB ? '1' : '0'}`}
          </div>
          <div style={{borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem', fontSize: '1.25rem'}}>
            Output = <span data-testid="ch8-output-display" style={{color: output ? 'var(--color-emerald)' : 'var(--color-ruby)', fontWeight: 'bold'}}>{output ? '1 (ON)' : '0 (OFF)'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
