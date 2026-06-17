import React, { useState } from 'react';
import { startTone, stopTone } from '../../utils/audio';

export default function Chapter5({ onComplete }) {
  const [keyActive, setKeyActive] = useState(false);
  const [rxSounderActive, setRxSounderActive] = useState(false);

  const handleKeyDown = () => {
    setKeyActive(true);
    setRxSounderActive(true);
    startTone(500);
    onComplete(true);
  };

  const handleKeyUp = () => {
    setKeyActive(false);
    setRxSounderActive(false);
    stopTone();
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <svg width="500" height="220" viewBox="0 0 500 220" style={{background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
        {/* House Left (Sender) */}
        <rect x="20" y="80" width="80" height="70" fill="#1e293b" />
        <polygon points="10,80 60,40 110,80" fill="#0f172a" />
        <text x="32" y="115" fill="white" fontSize="12">SENDER</text>
        
        {/* House Right (Receiver) */}
        <rect x="400" y="80" width="80" height="70" fill="#1e293b" />
        <polygon points="390,80 440,40 490,80" fill="#0f172a" />
        <text x="412" y="115" fill="white" fontSize="12">RECEIVER</text>

        {/* Key Switch (Left House) */}
        <line x1="40" y1="130" x2="80" y2={keyActive ? "130" : "120"} stroke="white" strokeWidth="3" />
        <circle cx="80" cy="130" r="3" fill="white" />
        
        {/* Signal Wire (Around Corners) */}
        <path d="M 80 130 Q 250 20 420 130" fill="none" stroke={keyActive ? "var(--color-cyan)" : "#374151"} strokeWidth="2.5" />
        
        {/* Sounder Electromagnet (Right House) */}
        <rect x="420" y="130" width="20" height="20" rx="2" fill={rxSounderActive ? "var(--color-purple)" : "#374151"} style={{filter: rxSounderActive ? 'drop-shadow(0 0 8px var(--color-purple))' : 'none'}} />
        {/* Armature arm */}
        <line x1="415" y1="120" x2="445" y2={rxSounderActive ? "127" : "120"} stroke="white" strokeWidth="3" />

        {/* Earth ground wire return */}
        <path d="M 60 150 L 60 190 L 440 190 L 440 150" fill="none" stroke={keyActive ? "var(--color-amber)" : "#4b5563"} strokeWidth="1.5" strokeDasharray="3,3" />
        {/* Ground plates */}
        <line x1="50" y1="190" x2="70" y2="190" stroke="#9ca3af" strokeWidth="2" />
        <line x1="430" y1="190" x2="450" y2="190" stroke="#9ca3af" strokeWidth="2" />
        <text x="220" y="210" fill="var(--text-secondary)" fontSize="11">EARTH RETURN PATH</text>
      </svg>
      
      <button 
        className="btn btn-primary"
        data-testid="ch5-telegraph-key"
        style={{padding: '1.5rem 2.5rem', fontSize: '1.1rem', userSelect: 'none'}}
        onMouseDown={handleKeyDown}
        onMouseUp={handleKeyUp}
        onTouchStart={handleKeyDown}
        onTouchEnd={handleKeyUp}
      >
        Telegraph Key (Press &amp; Hold)
      </button>
    </div>
  );
}
