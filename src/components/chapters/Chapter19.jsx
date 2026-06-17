import React, { useState } from 'react';

// --- CHAPTER 19: AN ASSEMBLAGE OF MEMORY (RAM GRID) ---
export default function Chapter19({ onComplete }) {
  const [ram, setRam] = useState(Array(64).fill(0)); // 8x8 grid of bits
  const [row, setRow] = useState(0); // 0-7
  const [col, setCol] = useState(0); // 0-7
  const [dataIn, setDataIn] = useState(0); // 0 or 1
  const [writeEnable, setWriteEnable] = useState(false);

  const executeWrite = () => {
    if (!writeEnable) return;
    const address = row * 8 + col;
    const nextRam = [...ram];
    nextRam[address] = dataIn;
    setRam(nextRam);
    
    // Check challenge: store a 1 at row 3, column 5 (address index = 3*8 + 5 = 29)
    if (row === 3 && col === 5 && dataIn === 1) {
      onComplete(true);
    }
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      {/* 8x8 Grid */}
      <div data-testid="ch19-ram-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(8, 30px)', gap: '4px', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)'}}>
        {ram.map((bit, idx) => {
          const r = Math.floor(idx / 8);
          const c = idx % 8;
          const isActive = r === row && c === col;
          return (
            <div 
              key={idx} 
              style={{
                width: '30px', 
                height: '30px', 
                background: bit ? 'var(--color-emerald)' : '#1f2937', 
                border: isActive ? '2px solid var(--color-cyan)' : '1px solid rgba(255,255,255,0.05)',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                color: bit ? 'black' : '#9ca3af',
                fontWeight: 'bold'
              }}
              onClick={() => {
                setRow(r);
                setCol(c);
              }}
            >
              {bit}
            </div>
          );
        })}
      </div>

      <div className="grid-2" style={{width: '100%', maxWidth: '400px'}}>
        <div className="glass-panel flex-column" style={{padding: '1rem', gap: '0.5rem'}}>
          <div>Address Row: <strong>{row}</strong></div>
          <input data-testid="ch19-row" type="range" min="0" max="7" value={row} onChange={(e) => setRow(parseInt(e.target.value, 10))} />
          <div>Address Col: <strong>{col}</strong></div>
          <input data-testid="ch19-col" type="range" min="0" max="7" value={col} onChange={(e) => setCol(parseInt(e.target.value, 10))} />
        </div>

        <div className="glass-panel flex-column" style={{padding: '1rem', gap: '0.75rem'}}>
          <button data-testid="ch19-we-btn" className={`btn ${writeEnable ? 'btn-danger' : 'btn-secondary'}`} onClick={() => setWriteEnable(!writeEnable)}>
            Write Enable (WE): {writeEnable ? 'ON' : 'OFF'}
          </button>
          
          <div className="flex-row" style={{justifyContent: 'center'}}>
            <button data-testid="ch19-data1-btn" className={`btn ${dataIn === 1 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDataIn(1)}>Data 1</button>
            <button data-testid="ch19-data0-btn" className={`btn ${dataIn === 0 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDataIn(0)}>Data 0</button>
          </div>
          
          <button data-testid="ch19-write-btn" className="btn btn-success" onClick={executeWrite}>Execute Write</button>
        </div>
      </div>
    </div>
  );
}
