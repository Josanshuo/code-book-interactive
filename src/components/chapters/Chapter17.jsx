import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import ToggleSwitch from '../shared/ToggleSwitch';

// --- CHAPTER 17: FEEDBACK AND FLIP-FLOOPS ---
export default function Chapter17({ onComplete }) {
  const [data, setData] = useState(false);
  const [clk, setClk] = useState(false);
  const [latchQ, setLatchQ] = useState(false); // Output state of D flip-flop

  const pulseClock = () => {
    setClk(true);
    setLatchQ(data); // Capture D value on positive edge
    setTimeout(() => {
      setClk(false);
    }, 150);
  };

  const wasCompleted = useRef(false);
  useEffect(() => {
    // Challenge target: store a 1 in D flip-flop (latchQ = true)
    const isNowComplete = latchQ;
    if (isNowComplete !== wasCompleted.current) {
      wasCompleted.current = isNowComplete;
      onComplete(isNowComplete);
    }
  }, [latchQ, onComplete]);

  const resetLab = () => {
    setData(false);
    setClk(false);
    setLatchQ(false);
    wasCompleted.current = false;
    onComplete(false);
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <div className="flex-row">
        <ToggleSwitch label="Data (D)" value={data} onChange={setData} testId="ch17-data" />
        <button data-testid="ch17-clk-btn" className="btn btn-primary" onClick={pulseClock}>
          CLK Pulse (CLK)
        </button>
      </div>

      <svg width="400" height="180" viewBox="0 0 400 180" style={{background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
        {/* Flip Flop Chip representation */}
        <rect x="120" y="30" width="160" height="120" rx="6" fill="#1e293b" stroke="white" strokeWidth="2" />
        <text x="145" y="100" fill="white" fontSize="16" fontFamily="monospace" fontWeight="bold">D FLIP-FLOP</text>

        {/* Inputs */}
        <line x1="40" y1="60" x2="120" y2="60" stroke={data ? "var(--color-cyan)" : "#4b5563"} strokeWidth="3" />
        <text x="50" y="52" fill="white" fontSize="12">D = {data ? '1' : '0'}</text>

        <line x1="40" y1="120" x2="120" y2="120" stroke={clk ? "var(--color-purple)" : "#4b5563"} strokeWidth="3" />
        <text x="50" y="112" fill="white" fontSize="12">CLK = {clk ? '1' : '0'}</text>

        {/* Output */}
        <line x1="280" y1="90" x2="360" y2="90" stroke={latchQ ? "var(--color-emerald)" : "#4b5563"} strokeWidth="3" />
        <text x="300" y="82" fill="white" fontSize="12">Q = {latchQ ? '1' : '0'}</text>
        <circle cx="360" cy="90" r="6" fill={latchQ ? "var(--color-emerald)" : "#4b5563"} />
      </svg>

      <button data-testid="ch17-reset-btn" className="btn btn-secondary" onClick={resetLab}><RotateCcw size={16} /> Reset Latch</button>
    </div>
  );
}
