import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

// --- CHAPTER 18: LET'S BUILD A CLOCK! ---
export default function Chapter18({ onComplete }) {
  const [freq, setFreq] = useState(1); // Hz
  const [isRunning, setIsRunning] = useState(false);
  const [count, setCount] = useState(0); // 4-bit counter (0-15)
  const timerRef = useRef(null);

  const wasCompleted = useRef(false);

  // Separate useEffect to handle completion based on count
  useEffect(() => {
    if (count === 7 && !wasCompleted.current) {
      wasCompleted.current = true;
      onComplete(true);
    }
  }, [count, onComplete]);

  useEffect(() => {
    if (isRunning) {
      const interval = 1000 / freq;
      timerRef.current = setInterval(() => {
        setCount(prev => (prev + 1) % 16);
      }, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, freq]);

  const toggleRun = () => {
    setIsRunning(!isRunning);
  };

  const resetCounter = () => {
    setCount(0);
    setIsRunning(false);
    wasCompleted.current = false;
    onComplete(false);
  };

  const getBinaryString = () => {
    return count.toString(2).padStart(4, '0');
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <div className="flex-row">
        <button data-testid="ch18-toggle-btn" className={`btn ${isRunning ? 'btn-danger' : 'btn-success'}`} onClick={toggleRun}>
          {isRunning ? <Pause size={16} /> : <Play size={16} />} {isRunning ? 'Stop Clock' : 'Start Clock'}
        </button>
        <button data-testid="ch18-reset-btn" className="btn btn-secondary" onClick={resetCounter}><RotateCcw size={16} /> Reset</button>
      </div>

      <div className="glass-panel flex-column" style={{padding: '1rem', width: '100%', maxWidth: '400px'}}>
        <label>Clock Frequency: <strong>{freq} Hz</strong></label>
        <input data-testid="ch18-freq" type="range" min="1" max="5" value={freq} onChange={(e) => setFreq(parseInt(e.target.value, 10))} style={{width: '100%'}} />
      </div>

      <div className="grid-2" style={{width: '100%', maxWidth: '400px'}}>
        <div className="glass-card text-mono flex-center" data-testid="ch18-count-decimal" style={{fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-pink)'}}>
          {count}
        </div>
        <div className="glass-card text-mono flex-center" data-testid="ch18-count-binary" style={{fontSize: '1.5rem', color: 'var(--color-cyan)'}}>
          {getBinaryString()}
        </div>
      </div>
    </div>
  );
}
