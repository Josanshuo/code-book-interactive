import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

// --- CHAPTER 22: REGISTERS AND BUSSES ---
export default function Chapter22({ onComplete }) {
  const [bus, setBus] = useState(0);
  const [regA, setRegA] = useState(85); // Initial state
  const [regB, setRegB] = useState(0);
  const [regC, setRegC] = useState(0);
  const [oeA, setOeA] = useState(false);
  const [oeB, setOeB] = useState(false);
  const [oeC, setOeC] = useState(false);
  const [ldA, setLdA] = useState(false);
  const [ldB, setLdB] = useState(false);
  const [ldC, setLdC] = useState(false);
  const [busContention, setBusContention] = useState(false);

  // Compute bus state depending on Output Enable signals
  useEffect(() => {
    const activeOutputs = [oeA, oeB, oeC].filter(Boolean).length;
    if (activeOutputs > 1) {
      setBusContention(true);
      setBus('ERR');
    } else {
      setBusContention(false);
      if (oeA) setBus(regA);
      else if (oeB) setBus(regB);
      else if (oeC) setBus(regC);
      else setBus(0);
    }
  }, [oeA, oeB, oeC, regA, regB, regC]);

  const clockPulse = () => {
    if (busContention || bus === 'ERR') return;
    if (ldA) setRegA(bus);
    if (ldB) setRegB(bus);
    if (ldC) {
      setRegC(bus);
      // Challenge target: Move 85 from A to C
      if (bus === 85) {
        onComplete(true);
      }
    }
  };

  const resetBusses = () => {
    setBus(0);
    setRegA(85);
    setRegB(0);
    setRegC(0);
    setOeA(false);
    setOeB(false);
    setOeC(false);
    setLdA(false);
    setLdB(false);
    setLdC(false);
    onComplete(false);
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      {/* Visual Bus line */}
      <div className="glass-card text-mono flex-center" data-testid="ch22-bus" style={{width: '100%', maxWidth: '500px', height: '50px', background: busContention ? 'var(--color-ruby-glow)' : 'rgba(0,0,0,0.4)', borderColor: busContention ? 'var(--color-ruby)' : 'var(--color-cyan)', borderWidth: '2px'}}>
        {busContention ? (
          <span style={{color: 'var(--color-ruby)', fontWeight: 'bold'}}>⚠️ BUS CONTENTION SHORT CIRCUIT!</span>
        ) : (
          <span>SHARED DATA BUS = <strong style={{color: 'var(--color-cyan)', fontSize: '1.25rem'}}>{bus}</strong></span>
        )}
      </div>

      <div className="grid-3" style={{width: '100%', maxWidth: '500px'}}>
        {/* Register A */}
        <div className="glass-panel flex-column" style={{padding: '1rem', alignItems: 'center'}}>
          <div style={{fontWeight: 700}}>Reg A: {regA}</div>
          <button data-testid="ch22-oe-a" className={`btn btn-secondary ${oeA ? 'btn-primary' : ''}`} onClick={() => setOeA(!oeA)}>OE (Out)</button>
          <button data-testid="ch22-ld-a" className={`btn btn-secondary ${ldA ? 'btn-success' : ''}`} onClick={() => setLdA(!ldA)}>LD (In)</button>
        </div>

        {/* Register B */}
        <div className="glass-panel flex-column" style={{padding: '1rem', alignItems: 'center'}}>
          <div style={{fontWeight: 700}}>Reg B: {regB}</div>
          <button data-testid="ch22-oe-b" className={`btn btn-secondary ${oeB ? 'btn-primary' : ''}`} onClick={() => setOeB(!oeB)}>OE (Out)</button>
          <button data-testid="ch22-ld-b" className={`btn btn-secondary ${ldB ? 'btn-success' : ''}`} onClick={() => setLdB(!ldB)}>LD (In)</button>
        </div>

        {/* Register C */}
        <div className="glass-panel flex-column" style={{padding: '1rem', alignItems: 'center'}}>
          <div style={{fontWeight: 700}}>Reg C: {regC}</div>
          <button data-testid="ch22-oe-c" className={`btn btn-secondary ${oeC ? 'btn-primary' : ''}`} onClick={() => setOeC(!oeC)}>OE (Out)</button>
          <button data-testid="ch22-ld-c" className={`btn btn-secondary ${ldC ? 'btn-success' : ''}`} onClick={() => setLdC(!ldC)}>LD (In)</button>
        </div>
      </div>

      <div className="flex-row">
        <button data-testid="ch22-clk-btn" className="btn btn-primary" onClick={clockPulse} disabled={busContention}>CLK PULSE</button>
        <button data-testid="ch22-reset-btn" className="btn btn-secondary" onClick={resetBusses}><RotateCcw size={16} /> Reset</button>
      </div>
    </div>
  );
}
