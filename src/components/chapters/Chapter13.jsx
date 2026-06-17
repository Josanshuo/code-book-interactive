import React, { useState, useRef } from 'react';
import { charToHexByte, charToBinaryByte } from '../../utils/binaryUtils';

export default function Chapter13({ onComplete }) {
  const [inputText, setInputText] = useState('');
  const wasCompleted = useRef(false);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);
    const isComplete = val === 'CODE';
    if (isComplete !== wasCompleted.current) {
      wasCompleted.current = isComplete;
      onComplete(isComplete);
    }
  };

  const getBytesOutput = () => {
    if (!inputText) return '';
    const bytes = [];
    for (let i = 0; i < inputText.length; i++) {
      bytes.push(charToHexByte(inputText[i]));
    }
    return bytes.join(' ');
  };

  const getBinaryOutput = () => {
    if (!inputText) return '';
    const bits = [];
    for (let i = 0; i < inputText.length; i++) {
      bits.push(charToBinaryByte(inputText[i]));
    }
    return bits.join(' ');
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <div className="glass-panel" style={{padding: '1.5rem', width: '100%', maxWidth: '480px'}}>
        <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600}}>Text Input:</label>
        <input 
          type="text" 
          className="btn btn-secondary text-mono" 
          data-testid="ch13-text-input"
          style={{background: '#090d16', border: '1px solid #1f2937', padding: '0.75rem 1rem', width: '100%', color: 'white', textAlign: 'center', fontSize: '1.2rem'}}
          placeholder="Type here..." 
          value={inputText}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex-column" style={{width: '100%', maxWidth: '480px', gap: '1rem'}}>
        <div className="glass-card text-mono">
          <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>ASCII Hex Bytes</div>
          <div data-testid="ch13-hex-output" style={{fontSize: '1.2rem', color: 'var(--color-pink)', fontWeight: 'bold', marginTop: '0.5rem', wordBreak: 'break-all'}}>{getBytesOutput() || '(empty)'}</div>
        </div>
        <div className="glass-card text-mono">
          <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>ASCII Binary Bits</div>
          <div data-testid="ch13-binary-output" style={{fontSize: '1rem', color: 'var(--color-cyan)', fontWeight: 'bold', marginTop: '0.5rem', wordBreak: 'break-all'}}>{getBinaryOutput() || '(empty)'}</div>
        </div>
      </div>
    </div>
  );
}
