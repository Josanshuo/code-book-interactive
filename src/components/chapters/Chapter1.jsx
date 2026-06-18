import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import { startTone, stopTone } from '../../utils/audio';
import { usePressAndHold } from '../../hooks/usePressAndHold';

// MORSE CODE MAP
const MORSE_MAP = {
  '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
  '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
  '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
  '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
  '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
  '--..': 'Z', '-----': '0', '.----': '1', '..---': '2', '...--': '3',
  '....-': '4', '.....': '5', '-....': '6', '--...': '7', '---..': '8',
  '----.': '9'
};

export default function Chapter1({ onComplete }) {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [morseBuffer, setMorseBuffer] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [completed, setCompleted] = useState(false);
  const morseBufferRef = useRef('');
  const pressTime = useRef(0);
  const silenceStart = useRef(Date.now());
  const timerRef = useRef(null);
  const wasCompleted = useRef(false);

  const handlePressStart = () => {
    setFlashlightOn(true);
    startTone(600);
    pressTime.current = Date.now();
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handlePressEnd = () => {
    setFlashlightOn(false);
    stopTone();
    const duration = Date.now() - pressTime.current;
    const symbol = duration < 200 ? '.' : '-';
    
    setMorseBuffer(prev => {
      const next = prev + symbol;
      morseBufferRef.current = next;
      return next;
    });
    silenceStart.current = Date.now();
    
    // Set timer to decode character after 700ms of silence
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      decodeCharacter();
    }, 700);
  };

  const flashlightPress = usePressAndHold(handlePressStart, handlePressEnd);

  // Check completion using useEffect to avoid state update in render warnings
  useEffect(() => {
    if (decodedText.includes("HI") && !completed) {
      setCompleted(true);
      if (!wasCompleted.current) {
        wasCompleted.current = true;
        onComplete(true);
      }
    }
  }, [decodedText, completed, onComplete]);

  const decodeCharacter = () => {
    const currentBuffer = morseBufferRef.current;
    if (!currentBuffer) return;
    const char = MORSE_MAP[currentBuffer] || '?';
    
    setDecodedText(prev => prev + char);
    setMorseBuffer('');
    morseBufferRef.current = '';
  };

  const resetLab = () => {
    setFlashlightOn(false);
    setMorseBuffer('');
    setDecodedText('');
    setCompleted(false);
    if (wasCompleted.current) {
      wasCompleted.current = false;
      onComplete(false);
    }
  };

  return (
    <div className="lab-container">
      <div className="neighborhood">
        <div className="house">
          <div className={`window ${flashlightOn ? 'lit' : ''}`}></div>
          <div style={{color: 'white', position: 'absolute', bottom: '-25px', width: '100%', textAlign: 'center', fontSize: '0.8rem'}}>House A (You)</div>
        </div>
        <div className={`light-beam ltr ${flashlightOn ? 'active' : ''}`} style={{display: flashlightOn ? 'block' : 'none'}}></div>
        <div className="house">
          <div className={`window ${flashlightOn ? 'lit' : ''}`} style={{boxShadow: flashlightOn ? '0 0 30px var(--color-cyan)' : 'none', backgroundColor: flashlightOn ? 'var(--color-cyan)' : ''}}></div>
          <div style={{color: 'white', position: 'absolute', bottom: '-25px', width: '100%', textAlign: 'center', fontSize: '0.8rem'}}>House B (Friend)</div>
        </div>
      </div>
      
      <div className="flex-column" style={{marginTop: '2rem', alignItems: 'center'}}>
        <div style={{display: 'flex', gap: '1rem'}}>
          <button 
            className="btn btn-primary"
            data-testid="ch1-flashlight-btn"
            style={{padding: '2rem', borderRadius: '50%', width: '100px', height: '100px', fontSize: '1.2rem', boxShadow: flashlightOn ? '0 0 20px var(--color-cyan)' : 'none', ...flashlightPress.touchStyle}}
            {...flashlightPress.handlers}
          >
            🔦
          </button>
          <button className="btn btn-secondary" data-testid="ch1-reset-btn" onClick={resetLab}><RotateCcw size={16} /> Reset</button>
        </div>
        
        <div className="glass-card text-mono" style={{width: '100%', maxWidth: '400px', textAlign: 'center', marginTop: '1rem'}}>
          <div>Current Code: <span data-testid="ch1-morse-buffer" style={{color: 'var(--color-cyan)', fontSize: '1.5rem'}}>{morseBuffer || '_'}</span></div>
          <div style={{marginTop: '0.5rem'}}>Decoded Message: <span data-testid="ch1-decoded-text" style={{color: 'var(--color-emerald)', fontSize: '1.5rem', fontWeight: 'bold'}}>{decodedText || '(waiting for signals)'}</span></div>
        </div>
      </div>
    </div>
  );
}
