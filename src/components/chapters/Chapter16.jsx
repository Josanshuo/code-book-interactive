import React, { useState, useEffect, useRef } from 'react';
import { toBinary } from '../../utils/binaryUtils';

// --- CHAPTER 16: BUT WHAT ABOUT SUBTRACTION? ---
export default function Chapter16({ onComplete }) {
  const [valA, setValA] = useState(12);
  const [valB, setValB] = useState(5);
  const [isSubtract, setIsSubtract] = useState(false);

  // 2's complement subtraction:
  // Output = A + (~B) + Cin (where Cin is 1 if subtracting)
  const carryIn = isSubtract ? 1 : 0;
  const operandB = isSubtract ? (~valB & 0xFF) : valB;
  const result = (valA + operandB + carryIn) & 0xFF;

  const wasCompleted = useRef(false);
  useEffect(() => {
    // Challenge target: valA = 12, valB = 5, isSubtract = true, result = 7
    const isNowComplete = valA === 12 && valB === 5 && isSubtract && result === 7;
    if (isNowComplete !== wasCompleted.current) {
      wasCompleted.current = isNowComplete;
      onComplete(isNowComplete);
    }
  }, [valA, valB, isSubtract, result, onComplete]);

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <p className="kid-intro">
        Computers don’t really know how to subtract! Their clever trick is to{' '}
        <strong
          className="jargon"
          title="Flip every bit (0↔1) and add 1. This turns a number into its negative, so the adder can 'subtract' by adding."
        >
          flip-and-add-one
        </strong>{' '}
        — then they just <strong>add</strong>. Try 12 − 5.
      </p>
      <div className="grid-2" style={{width: '100%', maxWidth: '500px'}}>
        <div className="glass-panel flex-column" style={{padding: '1rem'}}>
          <label>Operand A (Decimal): <strong>{valA}</strong></label>
          <input data-testid="ch16-val-a" type="range" min="0" max="100" value={valA} onChange={(e) => setValA(parseInt(e.target.value, 10))} style={{width: '100%'}} />
          <span className="text-mono" style={{fontSize: '0.85rem', color: 'var(--color-cyan)', marginTop: '0.5rem'}}>{toBinary(valA)}</span>
        </div>
        <div className="glass-panel flex-column" style={{padding: '1rem'}}>
          <label>Operand B (Decimal): <strong>{valB}</strong></label>
          <input data-testid="ch16-val-b" type="range" min="0" max="100" value={valB} onChange={(e) => setValB(parseInt(e.target.value, 10))} style={{width: '100%'}} />
          <span className="text-mono" style={{fontSize: '0.85rem', color: 'var(--color-cyan)', marginTop: '0.5rem'}}>{toBinary(valB)}</span>
        </div>
      </div>

      <div className="flex-row">
        <button data-testid="ch16-subtract-btn" className={`btn ${isSubtract ? 'btn-danger' : 'btn-secondary'}`} onClick={() => setIsSubtract(true)}>
          SUBTRACT MODE
        </button>
        <button data-testid="ch16-add-btn" className={`btn ${!isSubtract ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setIsSubtract(false)}>
          ADD MODE
        </button>
      </div>

      <div className="glass-card text-mono" data-testid="ch16-result" style={{width: '100%', maxWidth: '500px'}}>
        <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Calculations:</div>
        <div>  A: {toBinary(valA)} ({valA})</div>
        <div>{isSubtract ? '-' : '+'} B: {toBinary(operandB)} ({isSubtract ? `1's Comp of ${valB}` : valB})</div>
        {isSubtract && <div>+ Carry In: 1 (adds 1 to make 2's Complement)</div>}
        <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '0.5rem', paddingTop: '0.5rem', fontWeight: 'bold'}}>
          Result: {toBinary(result)} ({result})
        </div>
      </div>
    </div>
  );
}
