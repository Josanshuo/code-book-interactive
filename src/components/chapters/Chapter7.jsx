import React, { useState } from 'react';
import { playTone } from '../../utils/audio';
import { usePressAndHold } from '../../hooks/usePressAndHold';

export default function Chapter7({ onComplete }) {
  const [keyActive, setKeyActive] = useState(false);

  const handleKeyDown = () => {
    setKeyActive(true);
    playTone(400, 150);
    onComplete(true);
  };

  const handleKeyUp = () => {
    setKeyActive(false);
  };

  const keyPress = usePressAndHold(handleKeyDown, handleKeyUp);

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <svg height="220" viewBox="0 0 480 220" style={{width: '100%', maxWidth: '480px', height: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
        {/* Primary loop (low voltage) */}
        {/* Sender Morse Key */}
        <rect x="30" y="140" width="40" height="10" fill="#4b5563" />
        <line x1="30" y1="140" x2="70" y2={keyActive ? "140" : "130"} stroke="white" strokeWidth="4" />
        <circle cx="70" cy="140" r="3" fill="white" />

        {/* Primary Battery */}
        <rect x="120" y="150" width="50" height="30" rx="3" fill="#1e293b" stroke="#4b5563" />
        <text x="135" y="170" fill="white" fontSize="10">1.5V</text>

        {/* Relay Electromagnet coil */}
        {/* Coil shape */}
        <rect x="230" y="120" width="30" height="40" fill="#b45309" stroke="#d97706" rx="2" style={{filter: keyActive ? 'drop-shadow(0 0 8px #d97706)' : 'none'}} />
        {/* Coil wire loops visual */}
        <path d="M 230 125 L 260 125 M 230 135 L 260 135 M 230 145 L 260 145 M 230 155 L 260 155" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />

        {/* Primary circuit wires */}
        <path d="M 30 140 L 10 140 L 10 190 L 120 190 M 170 190 L 230 190 L 230 160" fill="none" stroke={keyActive ? "var(--color-cyan)" : "#374151"} strokeWidth="2" />
        <path d="M 70 140 L 90 140 L 90 190 L 120 190 M 170 165 L 245 165 L 245 160" fill="none" stroke={keyActive ? "var(--color-cyan)" : "#374151"} strokeWidth="2" />

        {/* Relay Contact Armature (Secondary switch) */}
        {/* Pull-down lever */}
        <line x1="280" y1="80" x2="280" y2={keyActive ? "120" : "105"} stroke="white" strokeWidth="4" />
        {/* Pivot */}
        <circle cx="280" cy="80" r="4" fill="white" />
        {/* Spring holding it up */}
        <path d="M 280 80 Q 295 90 295 70" fill="none" stroke="#6b7280" strokeWidth="1.5" />
        
        {/* Secondary Circuit (grows from the relay switch contacts) */}
        {/* Contacts */}
        <circle cx="280" cy="122" r="3" fill="#ffb300" />
        <circle cx="280" cy="128" r="3" fill="#ffb300" />

        {/* Secondary Battery */}
        <rect x="330" y="150" width="50" height="30" rx="3" fill="#1e293b" stroke="#4b5563" />
        <text x="345" y="170" fill="white" fontSize="10">9V</text>

        {/* Secondary lightbulb */}
        <circle cx="430" cy="110" r="16" fill={keyActive ? "rgba(253, 224, 71, 0.2)" : "rgba(75, 85, 99, 0.2)"} stroke="#9ca3af" strokeWidth="2" />
        <circle cx="430" cy="110" r="8" fill={keyActive ? "#fde047" : "transparent"} style={{filter: keyActive ? 'drop-shadow(0 0 10px #fde047)' : 'none'}} />

        {/* Secondary loop wiring */}
        <path d="M 280 128 L 280 190 L 330 190 M 380 190 L 430 190 L 430 126" fill="none" stroke={keyActive ? "var(--color-purple)" : "#374151"} strokeWidth="2" />
        <path d="M 280 80 L 355 80 L 355 165 L 330 165 M 380 165 L 430 165 L 430 126" fill="none" stroke={keyActive ? "var(--color-purple)" : "#374151"} strokeWidth="2" />
      </svg>
      <button 
        className="btn btn-primary"
        data-testid="ch7-telegraph-key"
        style={keyPress.touchStyle}
        {...keyPress.handlers}
      >
        Press Telegraph Key
      </button>
    </div>
  );
}
