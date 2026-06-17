import React, { useState, useEffect, useRef } from 'react';

// --- CHAPTER 15: IS THIS FOR REAL? (TTL CHIP BREADBOARD) ---
export default function Chapter15({ onComplete }) {
  const [pin1, setPin1] = useState(0); // Input 1A
  const [pin2, setPin2] = useState(0); // Input 1B
  const [vcc, setVcc] = useState(false); // Pin 14
  const [gnd, setGnd] = useState(false); // Pin 7

  // Pin 3 (Output 1Y) is NAND of Pin 1 and Pin 2, IF VCC is high and GND is connected.
  const getPin3 = () => {
    if (!vcc || !gnd) return 0; // Chip needs power
    return !(pin1 && pin2) ? 1 : 0;
  };

  const output = getPin3();

  const wasCompleted = useRef(false);
  useEffect(() => {
    // Challenge target: Connect VCC (1), GND (1), set Pin1=1, Pin2=1, verify Output=0
    const isNowComplete = vcc && gnd && pin1 === 1 && pin2 === 1 && output === 0;
    if (isNowComplete !== wasCompleted.current) {
      wasCompleted.current = isNowComplete;
      onComplete(isNowComplete);
    }
  }, [pin1, pin2, vcc, gnd, output, onComplete]);

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <div className="breadboard" style={{width: '100%', maxWidth: '500px'}}>
        <div style={{fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center'}}>SN7400 Quad 2-Input NAND Gate IC</div>
        
        {/* Chip drawing */}
        <div style={{background: '#111827', borderRadius: '4px', border: '2px solid #374151', padding: '1rem', position: 'relative', color: '#9ca3af', fontSize: '0.8rem'}}>
          <div style={{position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)', width: '8px', height: '16px', background: '#374151', borderTopRightRadius: '8px', borderBottomRightRadius: '8px'}}></div>
          
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
            <span style={{color: vcc ? 'var(--color-emerald)' : '#ef4444'}}>Pin 14: VCC</span>
            <span>Pin 13: 4B</span>
            <span>Pin 12: 4A</span>
            <span>Pin 11: 4Y</span>
          </div>

          <div className="flex-center" style={{margin: '1rem 0', color: 'white', fontWeight: 'bold'}}>
            7400 NAND
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '2rem'}}>
            <span style={{color: pin1 ? 'var(--color-cyan)' : 'white'}}>Pin 1: 1A</span>
            <span style={{color: pin2 ? 'var(--color-cyan)' : 'white'}}>Pin 2: 1B</span>
            <span style={{color: output ? 'var(--color-emerald)' : '#ef4444'}}>Pin 3: 1Y</span>
            <span style={{color: gnd ? 'var(--color-emerald)' : '#ef4444'}}>Pin 7: GND</span>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{width: '100%', maxWidth: '500px'}}>
        <div className="glass-panel flex-column" style={{padding: '1rem', gap: '0.5rem'}}>
          <div style={{fontWeight: 700}}>Power Connections:</div>
          <button data-testid="ch15-vcc-btn" className={`btn ${vcc ? 'btn-success' : 'btn-secondary'}`} onClick={() => setVcc(!vcc)}>
            Pin 14 VCC (5V): {vcc ? 'CONNECTED' : 'DISCONNECTED'}
          </button>
          <button data-testid="ch15-gnd-btn" className={`btn ${gnd ? 'btn-success' : 'btn-secondary'}`} onClick={() => setGnd(!gnd)}>
            Pin 7 GND: {gnd ? 'CONNECTED' : 'DISCONNECTED'}
          </button>
        </div>
        
        <div className="glass-panel flex-column" style={{padding: '1rem', gap: '0.5rem'}}>
          <div style={{fontWeight: 700}}>NAND Gate 1 Inputs:</div>
          <button data-testid="ch15-pin1-btn" className={`btn ${pin1 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setPin1(pin1 ? 0 : 1)}>
            Pin 1 Input A: {pin1}
          </button>
          <button data-testid="ch15-pin2-btn" className={`btn ${pin2 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setPin2(pin2 ? 0 : 1)}>
            Pin 2 Input B: {pin2}
          </button>
        </div>
      </div>

      <div className="glass-card text-mono" data-testid="ch15-output" style={{width: '100%', maxWidth: '500px', textAlign: 'center'}}>
        Output Pin 3 (1Y) LED = <span style={{color: output ? 'var(--color-emerald)' : 'var(--color-ruby)', fontWeight: 'bold'}}>{output ? 'HIGH (1)' : 'LOW (0)'}</span>
      </div>
    </div>
  );
}
