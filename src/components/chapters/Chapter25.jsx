import React, { useState } from 'react';

// --- CHAPTER 25: PERIPHERALS (VRAM / DISPLAY) ---
export default function Chapter25({ onComplete }) {
  const [pixels, setPixels] = useState(Array(256).fill(0)); // 16x16 grid
  const [scanCode, setScanCode] = useState('');

  const togglePixel = (idx) => {
    const nextPixels = [...pixels];
    nextPixels[idx] = nextPixels[idx] ? 0 : 1;
    setPixels(nextPixels);
    
    // Check challenge: at least one pixel turned on
    if (nextPixels.some(p => p === 1)) {
      onComplete(true);
    }
  };

  const handleKeyPress = (e) => {
    // Skip non-printable keys (e.g. Shift, Control, Meta, Arrow keys)
    if (e.key.length !== 1) return;
    // Simulate keyboard scan code interrupt
    const code = '0x' + e.key.charCodeAt(0).toString(16).toUpperCase();
    setScanCode(code);
    onComplete(true);
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center'}}>
        {/* Memory Mapped Display (16x16 Grid) */}
        <div className="glass-panel flex-column" style={{padding: '1rem', alignItems: 'center'}}>
          <div style={{fontWeight: 700, marginBottom: '0.5rem'}}>16x16 Memory-Mapped Display</div>
          <div data-testid="ch25-display-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(16, 12px)', gap: '1px', background: 'black', border: '2px solid #374151', padding: '2px'}}>
            {pixels.map((p, idx) => (
              <div 
                key={idx} 
                style={{
                  width: '12px', 
                  height: '12px', 
                  background: p ? 'var(--color-cyan)' : '#111827',
                  cursor: 'pointer'
                }}
                onClick={() => togglePixel(idx)}
              ></div>
            ))}
          </div>
        </div>

        {/* Keyboard Input */}
        <div className="glass-panel flex-column" style={{padding: '1rem', minWidth: '220px', gap: '1rem'}}>
          <div style={{fontWeight: 700}}>Keyboard Controller</div>
          <input 
            data-testid="ch25-keyboard-input"
            type="text"
            className="btn btn-secondary text-mono"
            placeholder="Type key here..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            spellCheck={false}
            onKeyDown={handleKeyPress}
            style={{background: '#090d16', border: '1px solid #1f2937', padding: '0.5rem', color: 'white', textAlign: 'center'}}
          />
          <div className="text-mono" style={{fontSize: '0.85rem'}}>
            Scan Code: <strong data-testid="ch25-scan-code" style={{color: 'var(--color-pink)'}}>{scanCode || 'None'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
