import React, { useState } from 'react';

// --- CHAPTER 23: CPU CONTROL SIGNALS ---
export default function Chapter23({ onComplete }) {
  const [step, setStep] = useState(0); // 0 fetch 1, 2, 3...
  const steps = [
    { title: "Fetch Step 1", desc: "Program Counter (PC) loads the address onto the address bus.", activeSig: ["PC_OE", "MAR_LD"] },
    { title: "Fetch Step 2", desc: "Memory Address Register (MAR) passes the address to RAM, which loads the instruction byte onto the data bus.", activeSig: ["RAM_OE", "IR_LD"] },
    { title: "Fetch Step 3", desc: "Instruction Register (IR) decodes the instruction. Increment PC.", activeSig: ["PC_INC"] },
    { title: "Execute Step 1", desc: "Assert ALU signals, perform addition on registers.", activeSig: ["ALU_ADD", "ACC_LD"] }
  ];

  const handleStep = () => {
    setStep(prev => {
      const next = (prev + 1) % steps.length;
      if (next === 3) {
        onComplete(true);
      }
      return next;
    });
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <div className="glass-panel flex-column" style={{padding: '1.5rem', width: '100%', maxWidth: '500px', gap: '1rem'}}>
        <div style={{display: 'flex', justifyContent: 'between', alignItems: 'center'}}>
          <span style={{fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-cyan)'}}>{steps[step].title}</span>
          <button data-testid="ch23-step-btn" className="btn btn-primary" onClick={handleStep}>Step Cycle</button>
        </div>
        <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem'}}>{steps[step].desc}</p>
        
        <div style={{borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem'}}>
          <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>Active Control ROM Signals:</div>
          <div data-testid="ch23-signals" style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
            {steps[step].activeSig.map(sig => (
              <span key={sig} style={{background: 'rgba(255, 46, 147, 0.15)', color: 'var(--color-pink)', border: '1px solid rgba(255, 46, 147, 0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'}}>{sig}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
