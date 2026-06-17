import React, { useState, useRef } from 'react';

export default function Chapter4({ onComplete }) {
  const [switchClosed, setSwitchClosed] = useState(false);
  const wasCompleted = useRef(false);

  const toggleSwitch = () => {
    const nextState = !switchClosed;
    setSwitchClosed(nextState);
    if (nextState !== wasCompleted.current) {
      wasCompleted.current = nextState;
      onComplete(nextState);
    }
  };

  return (
    <div className="lab-container flex-column" style={{alignItems: 'center', gap: '1.5rem'}}>
      <svg width="400" height="260" viewBox="0 0 400 260" style={{background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
        {/* Battery */}
        <rect x="50" y="90" width="80" height="40" rx="3" fill="#1f2937" stroke="#4b5563" strokeWidth="2" />
        <rect x="130" y="100" width="10" height="20" rx="2" fill="#d97706" />
        <text x="90" y="115" fill="white" fontSize="14" fontFamily="monospace" fontWeight="bold">1.5V</text>
        <text x="55" y="115" fill="#ef4444" fontSize="16" fontWeight="bold">-</text>
        <text x="115" y="115" fill="#10b981" fontSize="16" fontWeight="bold">+</text>

        {/* Bulb */}
        <circle cx="310" cy="110" r="25" fill={switchClosed ? "rgba(253, 224, 71, 0.2)" : "rgba(75, 85, 99, 0.2)"} stroke="#9ca3af" strokeWidth="2" />
        <circle cx="310" cy="110" r="15" fill={switchClosed ? "#fde047" : "transparent"} style={{filter: switchClosed ? 'drop-shadow(0 0 15px #fde047)' : 'none'}} />
        {/* Filament */}
        <path d="M 300 120 L 305 105 L 315 105 L 320 120" fill="none" stroke={switchClosed ? "#d97706" : "#4b5563"} strokeWidth="2" />

        {/* Wires */}
        {/* Bottom wire from - of battery to bulb */}
        <path d="M 50 110 L 25 110 L 25 210 L 310 210 L 310 135" fill="none" stroke={switchClosed ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />
        
        {/* Top wire from + of battery to switch, and switch to bulb */}
        <path d="M 140 110 L 190 110" fill="none" stroke={switchClosed ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />
        <path d="M 230 110 L 285 110" fill="none" stroke={switchClosed ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />

        {/* Switch terminals */}
        <circle cx="190" cy="110" r="4" fill="white" />
        <circle cx="230" cy="110" r="4" fill="white" />

        {/* Switch Lever */}
        <line 
          x1="190" 
          y1="110" 
          x2={switchClosed ? "230" : "220"} 
          y2={switchClosed ? "110" : "85"} 
          stroke="white" 
          strokeWidth="4" 
          strokeLinecap="round"
          style={{cursor: 'pointer', transition: 'all 0.1s ease'}} 
          onClick={toggleSwitch}
        />

        {/* Electron animation along wire when closed */}
        {switchClosed && (
          <path d="M 50 110 L 25 110 L 25 210 L 310 210 L 310 135 M 310 110 M 285 110 L 230 110 L 190 110 L 140 110" 
                fill="none" 
                stroke="white" 
                strokeWidth="3" 
                className="electron-flow" 
          />
        )}
      </svg>
      <div className="flex-row">
        <button className="btn btn-secondary" data-testid="ch4-switch-btn" onClick={toggleSwitch}>
          {switchClosed ? "Open Switch (OFF)" : "Close Switch (ON)"}
        </button>
      </div>
    </div>
  );
}
