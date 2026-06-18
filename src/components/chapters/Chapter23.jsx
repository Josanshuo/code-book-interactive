import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

// --- CHAPTER 23: CPU CONTROL SIGNALS ---
// The data "packet" actually travels along the bus from box to box so kids can
// SEE the instruction being fetched and run, instead of reading jargon.

const NODES = [
  { abbr: 'PC', name: 'Program Counter' },
  { abbr: 'RAM', name: 'Memory' },
  { abbr: 'IR', name: 'Instruction Box' },
  { abbr: 'ALU', name: 'Math Unit' },
  { abbr: 'ACC', name: 'Answer Box' },
];

const STEPS = [
  {
    title: 'Fetch · Step 1',
    to: 1, active: [0, 1], packet: '#5',
    plain: 'The Program Counter calls out an address: "Memory, what’s in box #5?"',
    sig: ['PC_OE', 'MAR_LD'],
  },
  {
    title: 'Fetch · Step 2',
    to: 2, active: [1, 2], packet: 'LOD',
    plain: 'Memory hands the instruction it found over to the Instruction Box.',
    sig: ['RAM_OE', 'IR_LD'],
  },
  {
    title: 'Fetch · Step 3',
    to: 0, active: [0], packet: '+1',
    plain: 'The counter ticks up by 1, ready for the next instruction.',
    sig: ['PC_INC'],
  },
  {
    title: 'Execute',
    to: 4, active: [3, 4], packet: '42',
    plain: 'The Math Unit does the work and drops the answer into the Answer Box.',
    sig: ['ALU_ADD', 'ACC_LD'],
  },
];

export default function Chapter23({ onComplete }) {
  const [step, setStep] = useState(0);

  const handleStep = () => {
    // Compute next outside setState so onComplete (which sets state in the
    // parent) never runs during React's render phase.
    const next = (step + 1) % STEPS.length;
    setStep(next);
    if (next === STEPS.length - 1) onComplete(true);
  };

  const reset = () => setStep(0);

  const current = STEPS[step];
  // Packet sits over the center of the destination node. Flex nodes share the
  // width evenly, so node i is centered at (i + 0.5) / count of the track.
  const packetLeft = ((current.to + 0.5) / NODES.length) * 100;

  return (
    <div className="lab-container flex-column" style={{ gap: '1.25rem', alignItems: 'center' }}>
      <p className="kid-intro">
        Watch a single instruction <strong>travel through the CPU</strong>. Press
        “Next Step” and follow the glowing packet from box to box.
      </p>

      {/* Animated bus diagram */}
      <div className="bus-stage">
        <div className="bus-line" />
        <div
          className="bus-packet"
          data-testid="ch23-packet"
          style={{ left: `${packetLeft}%` }}
        >
          {current.packet}
        </div>
        <div className="bus-nodes">
          {NODES.map((node, i) => (
            <div key={node.abbr} className={`bus-node ${current.active.includes(i) ? 'active' : ''}`}>
              <div className="bus-node-abbr">{node.abbr}</div>
              <div className="bus-node-name">{node.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Narration + controls */}
      <div className="glass-panel flex-column" style={{ padding: '1.25rem', width: '100%', maxWidth: '560px', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-cyan)' }}>
            {current.title} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.85rem' }}>({step + 1} of {STEPS.length})</span>
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button data-testid="ch23-step-btn" className="btn btn-primary" onClick={handleStep}>Next Step</button>
            <button className="btn btn-secondary" data-testid="ch23-reset-btn" onClick={reset} aria-label="Reset"><RotateCcw size={16} /></button>
          </div>
        </div>
        <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.5 }}>{current.plain}</p>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
          <div
            className="jargon"
            title="The control unit's real engineering name for what's happening this step."
            style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'inline-block' }}
          >
            Real engineer signals:
          </div>
          <div data-testid="ch23-signals" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {current.sig.map((sig) => (
              <span key={sig} style={{ background: 'rgba(255, 46, 147, 0.15)', color: 'var(--color-pink)', border: '1px solid rgba(255, 46, 147, 0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{sig}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
