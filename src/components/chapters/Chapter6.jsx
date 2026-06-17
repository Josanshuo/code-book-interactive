import React, { useState, useEffect, useRef } from 'react';
import ToggleSwitch from '../shared/ToggleSwitch';

export default function Chapter6({ onComplete }) {
  const [switchA, setSwitchA] = useState(false);
  const [switchB, setSwitchB] = useState(false);
  const [switchC, setSwitchC] = useState(false);
  const wasCompleted = useRef(false);

  // Challenge: A and B series, in parallel with C.
  // Bulb is lit if (A AND B) OR C.
  const isLit = (switchA && switchB) || switchC;

  useEffect(() => {
    const isNowComplete = (switchA && switchB) || switchC;
    if (isNowComplete !== wasCompleted.current) {
      wasCompleted.current = isNowComplete;
      onComplete(isNowComplete);
    }
  }, [switchA, switchB, switchC, onComplete]);

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <div className="flex-row" style={{gap: '2rem'}}>
        <ToggleSwitch label="Switch A" value={switchA} onChange={setSwitchA} testId="ch6-switch-a" />
        <ToggleSwitch label="Switch B" value={switchB} onChange={setSwitchB} testId="ch6-switch-b" />
        <ToggleSwitch label="Switch C" value={switchC} onChange={setSwitchC} testId="ch6-switch-c" />
      </div>

      <svg height="200" viewBox="0 0 420 200" style={{width: '100%', maxWidth: '420px', height: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
        {/* Left terminal */}
        <line x1="20" y1="100" x2="60" y2="100" stroke={isLit ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />
        
        {/* Split to Series branch (Top) and Parallel branch (Bottom) */}
        <path d="M 60 100 L 60 50 L 100 50" fill="none" stroke={(switchA && switchB) || switchC ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />
        <path d="M 60 100 L 60 150 L 180 150" fill="none" stroke={switchC ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />
        
        {/* Top branch: Switch A and Switch B in Series */}
        {/* Switch A */}
        <circle cx="100" cy="50" r="4" fill="white" />
        <circle cx="140" cy="50" r="4" fill="white" />
        <line x1="100" y1="50" x2={switchA ? "140" : "130"} y2={switchA ? "50" : "35"} stroke="white" strokeWidth="3.5" />
        <line x1="140" y1="50" x2="180" y2="50" stroke={switchA ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />

        {/* Switch B */}
        <circle cx="180" cy="50" r="4" fill="white" />
        <circle cx="220" cy="50" r="4" fill="white" />
        <line x1="180" y1="50" x2={switchB ? "220" : "210"} y2={switchB ? "50" : "35"} stroke="white" strokeWidth="3.5" />
        <line x1="220" y1="50" x2="260" y2="50" stroke={switchA && switchB ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />

        {/* Bottom branch: Switch C */}
        <circle cx="180" cy="150" r="4" fill="white" />
        <circle cx="220" cy="150" r="4" fill="white" />
        <line x1="180" y1="150" x2={switchC ? "220" : "210"} y2={switchC ? "150" : "135"} stroke="white" strokeWidth="3.5" />
        <line x1="220" y1="150" x2="260" y2="150" stroke={switchC ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />

        {/* Merge branches */}
        <path d="M 260 50 L 300 50 L 300 100" fill="none" stroke={switchA && switchB ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />
        <path d="M 260 150 L 300 150 L 300 100" fill="none" stroke={switchC ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />
        
        {/* Wire to bulb */}
        <line x1="300" y1="100" x2="340" y2="100" stroke={isLit ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />
        
        {/* Light Bulb */}
        <circle cx="365" cy="100" r="18" fill={isLit ? "rgba(253, 224, 71, 0.2)" : "rgba(75, 85, 99, 0.2)"} stroke="#9ca3af" strokeWidth="2" />
        <circle cx="365" cy="100" r="10" fill={isLit ? "#fde047" : "transparent"} style={{filter: isLit ? 'drop-shadow(0 0 10px #fde047)' : 'none'}} />
      </svg>
      <div className="glass-card text-mono" style={{padding: '0.5rem 1rem'}}>
        Circuit Equation: <span data-testid="ch6-equation-display" style={{color: 'var(--color-cyan)'}}>(A AND B) OR C = {isLit ? "TRUE" : "FALSE"}</span>
      </div>
    </div>
  );
}
