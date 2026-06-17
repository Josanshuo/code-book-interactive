import React, { useState, useEffect, useRef } from 'react';
import ToggleSwitch from '../shared/ToggleSwitch';

export default function Chapter14({ onComplete }) {
  const [inA, setInA] = useState(false);
  const [inB, setInB] = useState(false);
  const [inCin, setInCin] = useState(false);
  const wasCompleted = useRef(false);

  // Math logic
  const sum1 = inA !== inB;
  const carry1 = inA && inB;
  
  const sumOut = sum1 !== inCin;
  const carry2 = sum1 && inCin;
  
  const carryOut = carry1 || carry2;

  useEffect(() => {
    // Challenge target: A=1, B=1, Cin=0, output Sum=0, Cout=1
    const isNowComplete = inA && inB && !inCin && !sumOut && carryOut;
    if (isNowComplete !== wasCompleted.current) {
      wasCompleted.current = isNowComplete;
      onComplete(isNowComplete);
    }
  }, [inA, inB, inCin, sumOut, carryOut, onComplete]);

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <div className="flex-row" style={{gap: '1.5rem'}}>
        <ToggleSwitch label="Input A" value={inA} onChange={setInA} testId="ch14-input-a" />
        <ToggleSwitch label="Input B" value={inB} onChange={setInB} testId="ch14-input-b" />
        <ToggleSwitch label="Carry In (Cin)" value={inCin} onChange={setInCin} testId="ch14-input-cin" />
      </div>

      <svg width="460" height="200" viewBox="0 0 460 200" style={{background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
        {/* Schematic drawing of adders block */}
        <rect x="150" y="50" width="160" height="100" rx="6" fill="#1e293b" stroke="white" strokeWidth="2" />
        <text x="195" y="105" fill="white" fontSize="16" fontFamily="sans-serif" fontWeight="bold">FULL ADDER</text>

        {/* Inputs */}
        <line x1="40" y1="70" x2="150" y2="70" stroke={inA ? "var(--color-cyan)" : "#4b5563"} strokeWidth="3" />
        <text x="50" y="62" fill="white" fontSize="12">A = {inA ? '1' : '0'}</text>

        <line x1="40" y1="100" x2="150" y2="100" stroke={inB ? "var(--color-cyan)" : "#4b5563"} strokeWidth="3" />
        <text x="50" y="92" fill="white" fontSize="12">B = {inB ? '1' : '0'}</text>

        <line x1="40" y1="130" x2="150" y2="130" stroke={inCin ? "var(--color-cyan)" : "#4b5563"} strokeWidth="3" />
        <text x="50" y="122" fill="white" fontSize="12">Cin = {inCin ? '1' : '0'}</text>

        {/* Outputs */}
        <line x1="310" y1="75" x2="420" y2="75" stroke={sumOut ? "var(--color-emerald)" : "#4b5563"} strokeWidth="3" />
        <text x="370" y="67" fill="white" fontSize="12">Sum = {sumOut ? '1' : '0'}</text>
        <circle cx="420" cy="75" r="5" fill={sumOut ? "var(--color-emerald)" : "#4b5563"} />

        <line x1="310" y1="125" x2="420" y2="125" stroke={carryOut ? "var(--color-pink)" : "#4b5563"} strokeWidth="3" />
        <text x="360" y="117" fill="white" fontSize="12">Carry Out = {carryOut ? '1' : '0'}</text>
        <circle cx="420" cy="125" r="5" fill={carryOut ? "var(--color-pink)" : "#4b5563"} />
      </svg>
    </div>
  );
}
