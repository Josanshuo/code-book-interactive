import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

// --- CHAPTER 24: LOOPS, JUMPS, AND CALLS ---
export default function Chapter24({ onComplete }) {
  const [pc, setPc] = useState(0);
  const [regA, setRegA] = useState(3);
  const regARef = useRef(3);
  const [halted, setHalted] = useState(false);
  const [running, setRunning] = useState(false);

  const code = [
    { label: "00", inst: "LOD A, 3", desc: "Load 3 into Register A" },
    { label: "01", inst: "DEC A", desc: "Decrement A by 1" },
    { label: "02", inst: "JNZ 01", desc: "Jump to 01 if Zero Flag is not set (A != 0)" },
    { label: "03", inst: "HLT", desc: "Halt processor" }
  ];

  const stepProgram = useCallback(() => {
    if (pc === 0) {
      regARef.current = 3;
      setRegA(3);
      setPc(1);
    } else if (pc === 1) {
      setRegA(prev => {
        const next = prev - 1;
        regARef.current = next;
        return next;
      });
      setPc(2);
    } else if (pc === 2) {
      if (regARef.current !== 0) {
        setPc(1);
      } else {
        setPc(3);
      }
    } else if (pc === 3) {
      setHalted(true);
      setRunning(false);
      if (regARef.current === 0) {
        onComplete(true);
      }
    }
  }, [pc, onComplete]);

  useEffect(() => {
    let timer;
    if (running && !halted) {
      timer = setTimeout(() => {
        stepProgram();
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [running, pc, regA, halted, onComplete, stepProgram]);

  const handleRun = () => {
    setRunning(true);
    setHalted(false);
  };

  const handleReset = () => {
    setPc(0);
    setRegA(3);
    regARef.current = 3;
    setHalted(false);
    setRunning(false);
    onComplete(false);
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem'}}>
      <div className="flex-row">
        <button data-testid="ch24-run-btn" className="btn btn-primary" onClick={handleRun} disabled={running || halted}>Run Loop</button>
        <button data-testid="ch24-step-btn" className="btn btn-secondary" onClick={stepProgram} disabled={running || halted}>Step Code</button>
        <button data-testid="ch24-reset-btn" className="btn btn-secondary" onClick={handleReset}><RotateCcw size={16} /> Reset</button>
      </div>

      <div className="grid-2">
        {/* Assembly Code Listing */}
        <div className="glass-panel flex-column" style={{padding: '1rem'}}>
          <div style={{fontWeight: 700, marginBottom: '0.5rem'}}>Program memory</div>
          {code.map((line, idx) => (
            <div key={idx} style={{
              display: 'flex', 
              gap: '1rem', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.85rem', 
              padding: '0.3rem', 
              borderRadius: '4px',
              background: pc === idx ? 'rgba(0,242,254,0.1)' : 'transparent',
              color: pc === idx ? 'var(--color-cyan)' : 'inherit',
              border: pc === idx ? '1px solid rgba(0,242,254,0.2)' : '1px solid transparent'
            }}>
              <span style={{color: 'var(--text-muted)'}}>{line.label}</span>
              <span style={{fontWeight: 'bold', width: '80px'}}>{line.inst}</span>
              <span style={{color: 'var(--text-secondary)'}}>{'; '}{line.desc}</span>
            </div>
          ))}
        </div>

        {/* Registers */}
        <div className="glass-panel flex-column" style={{padding: '1rem', gap: '0.5rem'}}>
          <div style={{fontWeight: 700}}>CPU registers</div>
          <div className="text-mono">Program Counter (PC): <strong>{pc}</strong></div>
          <div className="text-mono">Register A: <strong data-testid="ch24-reg-a" style={{color: 'var(--color-pink)'}}>{regA}</strong></div>
          <div className="text-mono">Zero Flag (ZF): <strong>{regA === 0 ? '1' : '0'}</strong></div>
          <div className="text-mono">Status: <strong data-testid="ch24-status" style={{color: halted ? 'var(--color-ruby)' : 'var(--color-emerald)'}}>{halted ? 'HALTED' : running ? 'RUNNING' : 'IDLE'}</strong></div>
        </div>
      </div>
    </div>
  );
}
