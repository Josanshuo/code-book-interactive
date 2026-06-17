import React, { useState } from 'react';

export default function Chapter11({ onComplete }) {
  const [binaryCount, setBinaryCount] = useState([0,0,0,0,0,0,0,0]); // 8-bit counter
  const [upcLines] = useState([
    1,0,1, // Left guard
    0,0,0,1,1,0,1, // Digit 0
    0,1,1,0,0,1,1, // Digit 1
    0,1,0,1,0 // Center guard
  ]);
  const [isScanned, setIsScanned] = useState(false);

  const incrementCounter = () => {
    let num = parseInt(binaryCount.join(''), 2);
    num = (num + 1) % 256;
    const binStr = num.toString(2).padStart(8, '0');
    const nextCount = binStr.split('').map(Number);
    setBinaryCount(nextCount);
    
    // Check challenge: counter hits 128 (10000000)
    if (num === 128) {
      onComplete(true);
    }
  };

  const decrementCounter = () => {
    let num = parseInt(binaryCount.join(''), 2);
    num = num - 1;
    if (num < 0) num = 255;
    const binStr = num.toString(2).padStart(8, '0');
    const nextCount = binStr.split('').map(Number);
    setBinaryCount(nextCount);

    if (num === 128) {
      onComplete(true);
    }
  };

  const handleScan = () => {
    setIsScanned(true);
    // Auto-complete if they interact with scan
    onComplete(true);
  };

  const countVal = parseInt(binaryCount.join(''), 2);

  return (
    <div className="lab-container flex-column" style={{gap: '2rem'}}>
      {/* 8-bit counter */}
      <div className="glass-panel" style={{padding: '1.5rem'}}>
        <div style={{fontWeight: 700, marginBottom: '1rem', textAlign: 'center'}}>8-Bit Binary Counter</div>
        <div className="flex-row" style={{justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
          {binaryCount.map((bit, idx) => (
            <div key={idx} className="flex-column" style={{alignItems: 'center', gap: '0.25rem'}}>
              <div style={{fontSize: '0.7rem', color: 'var(--text-secondary)'}}>2^{7 - idx}</div>
              <div 
                className="flex-center text-mono" 
                data-testid={`ch11-bit-${idx}`}
                style={{
                  width: '35px', 
                  height: '35px', 
                  background: bit ? 'var(--color-cyan)' : '#1f2937', 
                  color: bit ? 'black' : 'white',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  boxShadow: bit ? '0 0 10px var(--color-cyan-glow)' : 'none',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  const next = [...binaryCount];
                  next[idx] = next[idx] ? 0 : 1;
                  setBinaryCount(next);
                  const nextVal = parseInt(next.join(''), 2);
                  if (nextVal === 128) onComplete(true);
                }}
              >
                {bit}
              </div>
            </div>
          ))}
        </div>
        <div className="flex-row" style={{justifyContent: 'center'}}>
          <button className="btn btn-secondary" data-testid="ch11-dec-btn" onClick={decrementCounter}>-1</button>
          <div className="text-mono flex-center" data-testid="ch11-counter-display" style={{fontSize: '1.25rem', width: '80px', fontWeight: 'bold'}}>{countVal}</div>
          <button className="btn btn-secondary" data-testid="ch11-inc-btn" onClick={incrementCounter}>+1</button>
        </div>
      </div>

      {/* UPC Barcode section */}
      <div className="glass-panel" style={{padding: '1.5rem'}}>
        <div style={{fontWeight: 700, marginBottom: '1rem', textAlign: 'center'}}>UPC-A Barcode Simulator</div>
        <div className="flex-center" style={{background: 'white', padding: '1rem', borderRadius: '4px', height: '100px', gap: '2px'}}>
          {upcLines.map((bar, idx) => (
            <div key={idx} style={{
              width: '4px', 
              height: '80px', 
              background: bar ? 'black' : 'transparent'
            }}></div>
          ))}
        </div>
        <div className="flex-center" style={{marginTop: '1rem'}}>
          <button className="btn btn-primary" data-testid="ch11-scan-btn" onClick={handleScan}>Scan Barcode</button>
        </div>
        {isScanned && (
          <div className="text-mono" style={{marginTop: '1rem', textAlign: 'center', color: 'var(--color-emerald)', fontSize: '0.9rem'}}>
            Decoded UPC bits: 101 [Left Guard] | 0001101 [0] | 0110011 [1] | 01010 [Center Guard]
          </div>
        )}
      </div>
    </div>
  );
}
