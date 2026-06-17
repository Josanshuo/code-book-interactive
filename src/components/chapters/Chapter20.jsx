import React, { useState, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

// --- CHAPTER 20: AUTOMATING ARITHMETIC ---
export default function Chapter20({ onComplete }) {
  const [ram, setRam] = useState({ 10: 12, 11: 15, 12: 0 });
  const [acc, setAcc] = useState(0);
  const accRef = useRef(0);
  const [pc, setPc] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [log, setLog] = useState([]);

  const instructions = [
    { op: 'LOAD 10', desc: 'Load the value at address 10 (12) into Accumulator' },
    { op: 'ADD 11', desc: 'Add the value at address 11 (15) to Accumulator' },
    { op: 'STORE 12', desc: 'Store the Accumulator value into address 12' }
  ];

  const stepProgram = () => {
    if (stepIndex >= instructions.length) return;
    if (stepIndex === 0) {
      const val = ram[10];
      accRef.current = val;
      setAcc(val);
      setLog(prev => [...prev, `LOD A, [10] -> ACC loaded with ${val}`]);
    } else if (stepIndex === 1) {
      setAcc(prev => {
        const next = prev + ram[11];
        accRef.current = next;
        setLog(logPrev => [...logPrev, `ADD A, [11] -> ACC added with ${ram[11]} (New ACC: ${next})`]);
        return next;
      });
    } else if (stepIndex === 2) {
      const currentAcc = accRef.current;
      setRam(prev => {
        const next = { ...prev, 12: currentAcc };
        setLog(logPrev => [...logPrev, `STO [12], A -> Address 12 stored with ACC value ${currentAcc}`]);
        return next;
      });
      // Challenge complete when sum of 12 and 15 (27) is stored at address 12
      if (currentAcc === 27) {
        onComplete(true);
      }
    }
    setPc(prev => prev + 1);
    setStepIndex(prev => prev + 1);
  };

  const resetProgram = () => {
    setRam({ 10: 12, 11: 15, 12: 0 });
    setAcc(0);
    accRef.current = 0;
    setPc(0);
    setStepIndex(0);
    setLog([]);
    onComplete(false);
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem'}}>
      <div className="flex-row">
        <button data-testid="ch20-step-btn" className="btn btn-primary" onClick={stepProgram} disabled={stepIndex >= instructions.length}>
          Step Instruction ({stepIndex < instructions.length ? instructions[stepIndex].op : 'HALTED'})
        </button>
        <button data-testid="ch20-reset-btn" className="btn btn-secondary" onClick={resetProgram}><RotateCcw size={16} /> Reset</button>
      </div>

      <div className="grid-3">
        <div className="glass-card text-mono">
          <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>RAM State</div>
          <div style={{marginTop: '0.5rem'}}>Address 10: {ram[10]}</div>
          <div>Address 11: {ram[11]}</div>
          <div>Address 12: <span data-testid="ch20-addr12" style={{color: ram[12] === 27 ? 'var(--color-emerald)' : 'var(--color-cyan)', fontWeight: 'bold'}}>{ram[12]}</span></div>
        </div>

        <div className="glass-card text-mono">
          <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>Registers</div>
          <div style={{marginTop: '0.5rem'}}>Accumulator (ACC): {acc}</div>
          <div>Program Counter (PC): {pc}</div>
        </div>

        <div className="glass-card text-mono" style={{maxHeight: '150px', overflowY: 'auto'}}>
          <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>Control Log</div>
          {log.map((line, idx) => (
            <div key={idx} style={{fontSize: '0.75rem', color: 'var(--color-emerald)', marginTop: '0.25rem'}}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
