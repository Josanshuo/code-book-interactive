import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Lightbulb, HelpCircle, CheckCircle2, XCircle, 
  RotateCcw, Hash, Binary, Activity, Code, Terminal, ArrowRight
} from 'lucide-react';

// Web Audio Helper for Morse & Telegraph
let audioCtx = null;
const playTone = (freq, durationMs) => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + durationMs / 1000);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + durationMs / 1000);
  } catch (e) {
    console.error("Audio Context failed", e);
  }
};

// Start Oscillator for press-and-hold
let activeOsc = null;
let activeGain = null;
const startTone = (freq) => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (activeOsc) return;
    activeOsc = audioCtx.createOscillator();
    activeGain = audioCtx.createGain();
    activeOsc.type = 'sine';
    activeOsc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    activeGain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    activeOsc.connect(activeGain);
    activeGain.connect(audioCtx.destination);
    activeOsc.start();
  } catch (e) {
    console.error(e);
  }
};

const stopTone = () => {
  try {
    if (activeOsc) {
      activeGain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      activeGain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.05);
      const tempOsc = activeOsc;
      setTimeout(() => tempOsc.stop(), 50);
      activeOsc = null;
      activeGain = null;
    }
  } catch (e) {
    console.error(e);
  }
};

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

// --- CHAPTER 1: BEST FRIENDS ---
export function Chapter1({ onComplete }) {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [morseBuffer, setMorseBuffer] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [completed, setCompleted] = useState(false);
  const morseBufferRef = useRef('');
  const pressTime = useRef(0);
  const silenceStart = useRef(Date.now());
  const timerRef = useRef(null);

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

  // Check completion using useEffect to avoid state update in render warnings
  useEffect(() => {
    if (decodedText.includes("HI") && !completed) {
      setCompleted(true);
      onComplete(true);
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
    morseBufferRef.current = '';
    onComplete(false);
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
            style={{padding: '2rem', borderRadius: '50%', width: '100px', height: '100px', fontSize: '1.2rem', boxShadow: flashlightOn ? '0 0 20px var(--color-cyan)' : 'none'}}
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
          >
            🔦
          </button>
          <button className="btn btn-secondary" onClick={resetLab}><RotateCcw size={16} /> Reset</button>
        </div>
        
        <div className="glass-card text-mono" style={{width: '100%', maxWidth: '400px', textAlign: 'center', marginTop: '1rem'}}>
          <div>Current Code: <span style={{color: 'var(--color-cyan)', fontSize: '1.5rem'}}>{morseBuffer || '_'}</span></div>
          <div style={{marginTop: '0.5rem'}}>Decoded Message: <span style={{color: 'var(--color-emerald)', fontSize: '1.5rem', fontWeight: 'bold'}}>{decodedText || '(waiting for signals)'}</span></div>
        </div>
      </div>
    </div>
  );
}

// --- CHAPTER 2: CODES AND COMBINATIONS ---
export function Chapter2({ onComplete }) {
  const [bits, setBits] = useState(3);
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const totalCombinations = Math.pow(2, bits);
  
  // Generate all binary combinations for the visual grid
  const getCombinations = () => {
    const list = [];
    for (let i = 0; i < totalCombinations; i++) {
      list.push(i.toString(2).padStart(bits, '0'));
    }
    return list;
  };

  const handleCheck = (e) => {
    e.preventDefault();
    if (parseInt(inputVal) === 32 && bits === 5) {
      onComplete(true);
      setErrorMsg('');
    } else if (bits !== 5) {
      setErrorMsg("Please adjust the bit slider to 5 first!");
    } else {
      setErrorMsg("Incorrect combination count. Try again!");
    }
  };

  return (
    <div className="lab-container">
      <div className="flex-column" style={{gap: '1.5rem'}}>
        <div className="glass-card">
          <label style={{display: 'flex', justifyContent: 'between', alignItems: 'center', width: '100%', marginBottom: '0.5rem'}}>
            <span>Number of Signals (Bits): <strong style={{color: 'var(--color-cyan)', fontSize: '1.2rem'}}>{bits}</strong></span>
          </label>
          <input 
            type="range" 
            min="1" 
            max="6" 
            value={bits} 
            onChange={(e) => {
              setBits(parseInt(e.target.value));
              onComplete(false);
            }} 
            style={{width: '100%', accentColor: 'var(--color-cyan)'}} 
          />
        </div>

        <div className="glass-card">
          <div style={{marginBottom: '0.5rem', fontWeight: 600}}>All Possible Combinations (Total: {totalCombinations}):</div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontFamily: 'var(--font-mono)'}}>
            {getCombinations().map((combo, idx) => (
              <span key={idx} style={{
                background: 'rgba(0,242,254,0.1)', 
                color: 'var(--color-cyan)', 
                padding: '0.2rem 0.5rem', 
                borderRadius: '4px',
                border: '1px solid rgba(0,242,254,0.2)'
              }}>{combo}</span>
            ))}
          </div>
        </div>

        <form onSubmit={handleCheck} className="flex-row" style={{alignItems: 'center', gap: '1rem'}}>
          <input 
            type="number" 
            className="btn btn-secondary" 
            placeholder="Enter total combinations..." 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            style={{background: '#111827', border: '1px solid #374151', padding: '0.6rem 1rem', width: '220px'}}
          />
          <button type="submit" className="btn btn-primary">Check Answer</button>
        </form>
        {errorMsg && <div style={{color: 'var(--color-ruby)', fontWeight: 600}}>{errorMsg}</div>}
      </div>
    </div>
  );
}

// --- CHAPTER 3: BRAILLE AND BINARY CODES ---
export function Chapter3({ onComplete }) {
  const [dots, setDots] = useState([false, false, false, false, false, false]); // Dot 1 to 6 (1-based index 1-6)

  // Braille character dictionary mapping dots key to letter
  // Key format: string of raised dot indices, e.g. "1,4" for C
  const BRAILLE_TO_CHAR = {
    "1": "A", "1,2": "B", "1,4": "C", "1,4,5": "D", "1,5": "E",
    "1,2,4": "F", "1,2,4,5": "G", "1,2,5": "H", "2,4": "I", "2,4,5": "J",
    "1,3": "K", "1,2,3": "L", "1,3,4": "M", "1,3,4,5": "N", "1,3,5": "O",
    "1,2,3,4": "P", "1,2,3,4,5": "Q", "1,2,3,5": "R", "2,3,4": "S", "2,3,4,5": "T",
    "1,3,6": "U", "1,2,3,6": "V", "2,4,5,6": "W", "1,3,4,6": "X", "1,3,4,5,6": "Y",
    "1,3,5,6": "Z"
  };

  const toggleDot = (idx) => {
    const nextDots = [...dots];
    nextDots[idx] = !nextDots[idx];
    setDots(nextDots);

    // Get list of active dots (1-based index)
    const active = [];
    nextDots.forEach((val, i) => {
      if (val) active.push(i + 1);
    });
    const key = active.join(",");
    
    // Check challenge: Letter C is dots 1 and 4
    if (key === "1,4") {
      onComplete(true);
    } else {
      onComplete(false);
    }
  };

  const getActiveCharacter = () => {
    const active = [];
    dots.forEach((val, i) => {
      if (val) active.push(i + 1);
    });
    return BRAILLE_TO_CHAR[active.join(",")] || "?";
  };

  const resetLab = () => {
    setDots([false, false, false, false, false, false]);
    onComplete(false);
  };

  return (
    <div className="lab-container flex-column" style={{alignItems: 'center', justify: 'center', gap: '2rem'}}>
      <div className="braille-grid">
        <button className={`braille-dot ${dots[0] ? 'active' : ''}`} onClick={() => toggleDot(0)} title="Dot 1"></button>
        <button className={`braille-dot ${dots[3] ? 'active' : ''}`} onClick={() => toggleDot(3)} title="Dot 4"></button>
        <button className={`braille-dot ${dots[1] ? 'active' : ''}`} onClick={() => toggleDot(1)} title="Dot 2"></button>
        <button className={`braille-dot ${dots[4] ? 'active' : ''}`} onClick={() => toggleDot(4)} title="Dot 5"></button>
        <button className={`braille-dot ${dots[2] ? 'active' : ''}`} onClick={() => toggleDot(2)} title="Dot 3"></button>
        <button className={`braille-dot ${dots[5] ? 'active' : ''}`} onClick={() => toggleDot(5)} title="Dot 6"></button>
      </div>

      <div className="glass-card text-mono" style={{textAlign: 'center', minWidth: '300px'}}>
        <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Raised Dots: {dots.map((val, i) => val ? i + 1 : null).filter(Boolean).join(", ") || "None"}</div>
        <div style={{fontSize: '2rem', color: 'var(--color-cyan)', fontWeight: 'bold', marginTop: '0.5rem'}}>Letter: {getActiveCharacter()}</div>
      </div>
      <button className="btn btn-secondary" onClick={resetLab}><RotateCcw size={16} /> Clear</button>
    </div>
  );
}

// --- CHAPTER 4: ANATOMY OF A FLASHLIGHT ---
export function Chapter4({ onComplete }) {
  const [switchClosed, setSwitchClosed] = useState(false);

  const toggleSwitch = () => {
    const nextState = !switchClosed;
    setSwitchClosed(nextState);
    if (nextState) {
      onComplete(true);
    } else {
      onComplete(false);
    }
  };

  return (
    <div className="lab-container flex-column" style={{alignItems: 'center', gap: '1.5rem'}}>
      <svg width="400" height="260" viewBox="0 0 400 260" style={{background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
        {/* Battery */}
        <rect x="50" y="90" width="80" height="40" rx="3" fill="#1f2937" stroke="#4b5563" strokeWidth="2" />
        <rect x="130" y="100" width="10" height="20" rx="2" fill="#d97706" />
        <text x="90" y="115" fill="white" fontSize="14" fontFamily="monospace" fontWeight="bold">1.5V</text>
        <text x="55" y="115" fill="#ef4444" fontSize="16" fontWeight="bold">-</text>
        <text x="115" y="115" fill="#10b981" fontSize="16" fontWeight="bold">+</text>

        {/* Bulb */}
        <circle cx="310" cy="110" r="25" fill={switchClosed ? "rgba(253, 224, 71, 0.2)" : "rgba(75, 85, 99, 0.2)"} stroke="#9ca3af" strokeWidth="2" />
        <circle cx="310" cy="110" r="15" fill={switchClosed ? "#fde047" : "transparent"} style={{filter: switchClosed ? 'drop-shadow(0 0 15px #fde047)' : 'none'}} />
        {/* Filament */}
        <path d="M 300 120 L 305 105 L 315 105 L 320 120" fill="none" stroke={switchClosed ? "#d97706" : "#4b5563"} strokeWidth="2" />

        {/* Wires */}
        {/* Bottom wire from - of battery to bulb */}
        <path d="M 50 110 L 25 110 L 25 210 L 310 210 L 310 135" fill="none" stroke={switchClosed ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />
        
        {/* Top wire from + of battery to switch, and switch to bulb */}
        <path d="M 140 110 L 190 110" fill="none" stroke={switchClosed ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />
        <path d="M 230 110 L 285 110" fill="none" stroke={switchClosed ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />

        {/* Switch terminals */}
        <circle cx="190" cy="110" r="4" fill="white" />
        <circle cx="230" cy="110" r="4" fill="white" />

        {/* Switch Lever */}
        <line 
          x1="190" 
          y1="110" 
          x2={switchClosed ? "230" : "220"} 
          y2={switchClosed ? "110" : "85"} 
          stroke="white" 
          strokeWidth="4" 
          strokeLinecap="round"
          style={{cursor: 'pointer', transition: 'all 0.1s ease'}} 
          onClick={toggleSwitch}
        />

        {/* Electron animation along wire when closed */}
        {switchClosed && (
          <path d="M 50 110 L 25 110 L 25 210 L 310 210 L 310 135 M 310 110 M 285 110 L 230 110 L 190 110 L 140 110" 
                fill="none" 
                stroke="white" 
                strokeWidth="3" 
                className="electron-flow" 
          />
        )}
      </svg>
      <div className="flex-row">
        <button className="btn btn-secondary" onClick={toggleSwitch}>
          {switchClosed ? "Open Switch (OFF)" : "Close Switch (ON)"}
        </button>
      </div>
    </div>
  );
}

// --- CHAPTER 5: COMMUNICATING AROUND CORNERS ---
export function Chapter5({ onComplete }) {
  const [keyActive, setKeyActive] = useState(false);
  const [rxSounderActive, setRxSounderActive] = useState(false);

  const handleKeyDown = () => {
    setKeyActive(true);
    setRxSounderActive(true);
    startTone(500);
    onComplete(true);
  };

  const handleKeyUp = () => {
    setKeyActive(false);
    setRxSounderActive(false);
    stopTone();
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <svg width="500" height="220" viewBox="0 0 500 220" style={{background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
        {/* House Left (Sender) */}
        <rect x="20" y="80" width="80" height="70" fill="#1e293b" />
        <polygon points="10,80 60,40 110,80" fill="#0f172a" />
        <text x="32" y="115" fill="white" fontSize="12">SENDER</text>
        
        {/* House Right (Receiver) */}
        <rect x="400" y="80" width="80" height="70" fill="#1e293b" />
        <polygon points="390,80 440,40 490,80" fill="#0f172a" />
        <text x="412" y="115" fill="white" fontSize="12">RECEIVER</text>

        {/* Key Switch (Left House) */}
        <line x1="40" y1="130" x2="80" y2={keyActive ? "130" : "120"} stroke="white" strokeWidth="3" />
        <circle cx="80" cy="130" r="3" fill="white" />
        
        {/* Signal Wire (Around Corners) */}
        <path d="M 80 130 Q 250 20 420 130" fill="none" stroke={keyActive ? "var(--color-cyan)" : "#374151"} strokeWidth="2.5" />
        
        {/* Sounder Electromagnet (Right House) */}
        <rect x="420" y="130" width="20" height="20" rx="2" fill={rxSounderActive ? "var(--color-purple)" : "#374151"} style={{filter: rxSounderActive ? 'drop-shadow(0 0 8px var(--color-purple))' : 'none'}} />
        {/* Armature arm */}
        <line x1="415" y1="120" x2="445" y2={rxSounderActive ? "127" : "120"} stroke="white" strokeWidth="3" />

        {/* Earth ground wire return */}
        <path d="M 60 150 L 60 190 L 440 190 L 440 150" fill="none" stroke={keyActive ? "var(--color-amber)" : "#4b5563"} strokeWidth="1.5" strokeDasharray="3,3" />
        {/* Ground plates */}
        <line x1="50" y1="190" x2="70" y2="190" stroke="#9ca3af" strokeWidth="2" />
        <line x1="430" y1="190" x2="450" y2="190" stroke="#9ca3af" strokeWidth="2" />
        <text x="220" y="210" fill="var(--text-secondary)" fontSize="11">EARTH RETURN PATH</text>
      </svg>
      
      <button 
        className="btn btn-primary"
        style={{padding: '1.5rem 2.5rem', fontSize: '1.1rem', userSelect: 'none'}}
        onMouseDown={handleKeyDown}
        onMouseUp={handleKeyUp}
        onTouchStart={handleKeyDown}
        onTouchEnd={handleKeyUp}
      >
        Telegraph Key (Press & Hold)
      </button>
    </div>
  );
}

// --- CHAPTER 6: LOGIC WITH SWITCHES ---
export function Chapter6({ onComplete }) {
  const [switchA, setSwitchA] = useState(false);
  const [switchB, setSwitchB] = useState(false);
  const [switchC, setSwitchC] = useState(false);

  // Challenge: A and B series, in parallel with C.
  // Bulb is lit if (A AND B) OR C.
  const isLit = (switchA && switchB) || switchC;

  useEffect(() => {
    if ((switchA && switchB) || switchC) {
      onComplete(true);
    } else {
      onComplete(false);
    }
  }, [switchA, switchB, switchC]);

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <div className="flex-row" style={{gap: '2rem'}}>
        <div className="switch-control" onClick={() => setSwitchA(!switchA)}>
          <span className="switch-label">Switch A</span>
          <div className={`switch-toggle ${switchA ? 'on' : ''}`}>
            <div className="switch-toggle-handle"></div>
          </div>
        </div>
        
        <div className="switch-control" onClick={() => setSwitchB(!switchB)}>
          <span className="switch-label">Switch B</span>
          <div className={`switch-toggle ${switchB ? 'on' : ''}`}>
            <div className="switch-toggle-handle"></div>
          </div>
        </div>

        <div className="switch-control" onClick={() => setSwitchC(!switchC)}>
          <span className="switch-label">Switch C</span>
          <div className={`switch-toggle ${switchC ? 'on' : ''}`}>
            <div className="switch-toggle-handle"></div>
          </div>
        </div>
      </div>

      <svg width="420" height="200" viewBox="0 0 420 200" style={{background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
        {/* Left terminal */}
        <line x1="20" y1="100" x2="60" y2="100" stroke={isLit ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />
        
        {/* Split to Series branch (Top) and Parallel branch (Bottom) */}
        <path d="M 60 100 L 60 50 L 100 50" fill="none" stroke={(switchA && switchB) || switchC ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />
        <path d="M 60 100 L 60 150 L 180 150" fill="none" stroke={switchC ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />
        
        {/* Top branch: Switch A and Switch B in Series */}
        {/* Switch A */}
        <circle cx="100" cy="50" r="4" fill="white" />
        <circle cx="140" cy="50" r="4" fill="white" />
        <line x1="100" y1="50" x2={switchA ? "140" : "130"} y2={switchA ? "50" : "35"} stroke="white" strokeWidth="3.5" />
        <line x1="140" y1="50" x2="180" y2="50" stroke={switchA ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />

        {/* Switch B */}
        <circle cx="180" cy="50" r="4" fill="white" />
        <circle cx="220" cy="50" r="4" fill="white" />
        <line x1="180" y1="50" x2={switchB ? "220" : "210"} y2={switchB ? "50" : "35"} stroke="white" strokeWidth="3.5" />
        <line x1="220" y1="50" x2="260" y2="50" stroke={switchA && switchB ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />

        {/* Bottom branch: Switch C */}
        <circle cx="180" cy="150" r="4" fill="white" />
        <circle cx="220" cy="150" r="4" fill="white" />
        <line x1="180" y1="150" x2={switchC ? "220" : "210"} y2={switchC ? "150" : "135"} stroke="white" strokeWidth="3.5" />
        <line x1="220" y1="150" x2="260" y2="150" stroke={switchC ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />

        {/* Merge branches */}
        <path d="M 260 50 L 300 50 L 300 100" fill="none" stroke={switchA && switchB ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />
        <path d="M 260 150 L 300 150 L 300 100" fill="none" stroke={switchC ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />
        
        {/* Wire to bulb */}
        <line x1="300" y1="100" x2="340" y2="100" stroke={isLit ? "var(--color-cyan)" : "#374151"} strokeWidth="3" />
        
        {/* Light Bulb */}
        <circle cx="365" cy="100" r="18" fill={isLit ? "rgba(253, 224, 71, 0.2)" : "rgba(75, 85, 99, 0.2)"} stroke="#9ca3af" strokeWidth="2" />
        <circle cx="365" cy="100" r="10" fill={isLit ? "#fde047" : "transparent"} style={{filter: isLit ? 'drop-shadow(0 0 10px #fde047)' : 'none'}} />
      </svg>
      <div className="glass-card text-mono" style={{padding: '0.5rem 1rem'}}>
        Circuit Equation: <span style={{color: 'var(--color-cyan)'}}>(A AND B) OR C = {isLit ? "TRUE" : "FALSE"}</span>
      </div>
    </div>
  );
}

// --- CHAPTER 7: TELEGRAPHS AND RELAYS ---
export function Chapter7({ onComplete }) {
  const [keyActive, setKeyActive] = useState(false);

  const handleKeyDown = () => {
    setKeyActive(true);
    playTone(400, 150);
    onComplete(true);
  };

  const handleKeyUp = () => {
    setKeyActive(false);
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <svg width="480" height="220" viewBox="0 0 480 220" style={{background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
        {/* Primary loop (low voltage) */}
        {/* Sender Morse Key */}
        <rect x="30" y="140" width="40" height="10" fill="#4b5563" />
        <line x1="30" y1="140" x2="70" y2={keyActive ? "140" : "130"} stroke="white" strokeWidth="4" />
        <circle cx="70" cy="140" r="3" fill="white" />

        {/* Primary Battery */}
        <rect x="120" y="150" width="50" height="30" rx="3" fill="#1e293b" stroke="#4b5563" />
        <text x="135" y="170" fill="white" fontSize="10">1.5V</text>

        {/* Relay Electromagnet coil */}
        {/* Coil shape */}
        <rect x="230" y="120" width="30" height="40" fill="#b45309" stroke="#d97706" rx="2" style={{filter: keyActive ? 'drop-shadow(0 0 8px #d97706)' : 'none'}} />
        {/* Coil wire loops visual */}
        <path d="M 230 125 L 260 125 M 230 135 L 260 135 M 230 145 L 260 145 M 230 155 L 260 155" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />

        {/* Primary circuit wires */}
        <path d="M 30 140 L 10 140 L 10 190 L 120 190 M 170 190 L 230 190 L 230 160" fill="none" stroke={keyActive ? "var(--color-cyan)" : "#374151"} strokeWidth="2" />
        <path d="M 70 140 L 90 140 L 90 190 L 120 190 M 170 165 L 245 165 L 245 160" fill="none" stroke={keyActive ? "var(--color-cyan)" : "#374151"} strokeWidth="2" />

        {/* Relay Contact Armature (Secondary switch) */}
        {/* Pull-down lever */}
        <line x1="280" y1="80" x2="280" y2={keyActive ? "120" : "105"} stroke="white" strokeWidth="4" />
        {/* Pivot */}
        <circle cx="280" cy="80" r="4" fill="white" />
        {/* Spring holding it up */}
        <path d="M 280 80 Q 295 90 295 70" fill="none" stroke="#6b7280" strokeWidth="1.5" />
        
        {/* Secondary Circuit (grows from the relay switch contacts) */}
        {/* Contacts */}
        <circle cx="280" cy="122" r="3" fill="#ffb300" />
        <circle cx="280" cy="128" r="3" fill="#ffb300" />

        {/* Secondary Battery */}
        <rect x="330" y="150" width="50" height="30" rx="3" fill="#1e293b" stroke="#4b5563" />
        <text x="345" y="170" fill="white" fontSize="10">9V</text>

        {/* Secondary lightbulb */}
        <circle cx="430" cy="110" r="16" fill={keyActive ? "rgba(253, 224, 71, 0.2)" : "rgba(75, 85, 99, 0.2)"} stroke="#9ca3af" strokeWidth="2" />
        <circle cx="430" cy="110" r="8" fill={keyActive ? "#fde047" : "transparent"} style={{filter: keyActive ? 'drop-shadow(0 0 10px #fde047)' : 'none'}} />

        {/* Secondary loop wiring */}
        <path d="M 280 128 L 280 190 L 330 190 M 380 190 L 430 190 L 430 126" fill="none" stroke={keyActive ? "var(--color-purple)" : "#374151"} strokeWidth="2" />
        <path d="M 280 80 L 355 80 L 355 165 L 330 165 M 380 165 L 430 165 L 430 126" fill="none" stroke={keyActive ? "var(--color-purple)" : "#374151"} strokeWidth="2" />
      </svg>
      <button 
        className="btn btn-primary"
        onMouseDown={handleKeyDown}
        onMouseUp={handleKeyUp}
        onTouchStart={handleKeyDown}
        onTouchEnd={handleKeyUp}
      >
        Press Telegraph Key
      </button>
    </div>
  );
}

// --- CHAPTER 8: RELAYS AND GATES ---
export function Chapter8({ onComplete }) {
  const [gateType, setGateType] = useState('XOR');
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);

  const getOutput = () => {
    switch(gateType) {
      case 'NOT': return !inputA;
      case 'AND': return inputA && inputB;
      case 'OR':  return inputA || inputB;
      case 'NAND': return !(inputA && inputB);
      case 'NOR':  return !(inputA || inputB);
      case 'XOR':  return inputA !== inputB;
      default: return false;
    }
  };

  const output = getOutput();

  useEffect(() => {
    // Challenge is for XOR: find input combination that outputs 1.
    // e.g. A=1, B=0 or A=0, B=1.
    if (gateType === 'XOR' && output) {
      onComplete(true);
    } else {
      onComplete(false);
    }
  }, [gateType, inputA, inputB, output]);

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem'}}>
      <div className="flex-row" style={{justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap'}}>
        {['NOT', 'AND', 'OR', 'NAND', 'NOR', 'XOR'].map((type) => (
          <button 
            key={type}
            className={`btn ${gateType === type ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setGateType(type);
              setInputA(false);
              setInputB(false);
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex-row" style={{justifyContent: 'center', gap: '2rem'}}>
        <div className="switch-control" onClick={() => setInputA(!inputA)}>
          <span className="switch-label">Input A</span>
          <div className={`switch-toggle ${inputA ? 'on' : ''}`}>
            <div className="switch-toggle-handle"></div>
          </div>
        </div>
        {gateType !== 'NOT' && (
          <div className="switch-control" onClick={() => setInputB(!inputB)}>
            <span className="switch-label">Input B</span>
            <div className={`switch-toggle ${inputB ? 'on' : ''}`}>
              <div className="switch-toggle-handle"></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-column" style={{alignItems: 'center'}}>
        <div className="glass-card text-mono" style={{textAlign: 'center', width: '300px'}}>
          <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Logic Symbol Representation:</div>
          <div style={{fontSize: '1.5rem', margin: '1rem 0', color: 'var(--color-pink)', fontWeight: 'bold'}}>
            {gateType === 'NOT' ? `NOT ${inputA ? '1' : '0'}` : `${inputA ? '1' : '0'} ${gateType} ${inputB ? '1' : '0'}`}
          </div>
          <div style={{borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem', fontSize: '1.25rem'}}>
            Output = <span style={{color: output ? 'var(--color-emerald)' : 'var(--color-ruby)', fontWeight: 'bold'}}>{output ? '1 (ON)' : '0 (OFF)'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CHAPTER 9: OUR TEN DIGITS ---
export function Chapter9({ onComplete }) {
  const [digits, setDigits] = useState([0, 0, 0, 0]); // Thousands, Hundreds, Tens, Ones

  const handleDigitChange = (idx, increment) => {
    const nextDigits = [...digits];
    let nextVal = nextDigits[idx] + increment;
    if (nextVal > 9) nextVal = 0;
    if (nextVal < 0) nextVal = 9;
    nextDigits[idx] = nextVal;
    setDigits(nextDigits);

    const total = nextDigits[0]*1000 + nextDigits[1]*100 + nextDigits[2]*10 + nextDigits[3];
    if (total === 2048) {
      onComplete(true);
    } else {
      onComplete(false);
    }
  };

  const total = digits[0]*1000 + digits[1]*100 + digits[2]*10 + digits[3];

  return (
    <div className="lab-container flex-column" style={{gap: '2rem', alignItems: 'center'}}>
      <div className="flex-row" style={{gap: '1rem'}}>
        {['1000s', '100s', '10s', '1s'].map((place, idx) => (
          <div key={idx} className="glass-panel" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.75rem', minWidth: '70px'}}>
            <button className="btn btn-secondary" style={{padding: '0.25rem 0.5rem'}} onClick={() => handleDigitChange(idx, 1)}>+</button>
            <div className="text-mono" style={{fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'var(--color-cyan)'}}>{digits[idx]}</div>
            <button className="btn btn-secondary" style={{padding: '0.25rem 0.5rem'}} onClick={() => handleDigitChange(idx, -1)}>-</button>
            <div style={{fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem'}}>{place}</div>
          </div>
        ))}
      </div>

      <div className="glass-card text-mono" style={{width: '100%', maxWidth: '450px', textAlign: 'center'}}>
        <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Expansion:</div>
        <div style={{fontSize: '1rem', color: 'white', margin: '0.5rem 0'}}>
          ({digits[0]} × 10³) + ({digits[1]} × 10²) + ({digits[2]} × 10¹) + ({digits[3]} × 10⁰)
        </div>
        <div style={{fontSize: '1rem', color: 'var(--text-secondary)', margin: '0.5rem 0'}}>
          {digits[0]*1000} + {digits[1]*100} + {digits[2]*10} + {digits[3]*1}
        </div>
        <div style={{borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', fontSize: '1.5rem', fontWeight: 'bold'}}>
          Total Value = <span style={{color: 'var(--color-emerald)'}}>{total}</span>
        </div>
      </div>
    </div>
  );
}

// --- CHAPTER 10: ALTERNATIVE 10S ---
export function Chapter10({ onComplete }) {
  const [decInput, setDecInput] = useState('');

  const handleInputChange = (e) => {
    const val = e.target.value;
    setDecInput(val);
    const parsed = parseInt(val);
    
    // Challenge target binary '101010' = 42 decimal
    if (parsed === 42) {
      onComplete(true);
    } else {
      onComplete(false);
    }
  };

  const getOctal = () => {
    const num = parseInt(decInput);
    return isNaN(num) ? '' : num.toString(8);
  };

  const getBinary = () => {
    const num = parseInt(decInput);
    return isNaN(num) ? '' : num.toString(2);
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <div className="glass-panel" style={{padding: '1.5rem', width: '100%', maxWidth: '400px'}}>
        <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 600}}>Decimal (Base 10) Input:</label>
        <input 
          type="number" 
          className="btn btn-secondary" 
          style={{background: '#090d16', border: '1px solid #1f2937', padding: '0.75rem 1rem', width: '100%', color: 'white', textAlign: 'center', fontSize: '1.2rem'}}
          placeholder="Enter a decimal number..." 
          value={decInput}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid-2" style={{width: '100%', maxWidth: '400px'}}>
        <div className="glass-card text-mono" style={{textAlign: 'center'}}>
          <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>Octal (Base 8)</div>
          <div style={{fontSize: '1.5rem', color: 'var(--color-amber)', fontWeight: 'bold', marginTop: '0.5rem'}}>{getOctal() || '-'}</div>
        </div>
        <div className="glass-card text-mono" style={{textAlign: 'center'}}>
          <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>Binary (Base 2)</div>
          <div style={{fontSize: '1.5rem', color: 'var(--color-cyan)', fontWeight: 'bold', marginTop: '0.5rem'}}>{getBinary() || '-'}</div>
        </div>
      </div>
    </div>
  );
}

// --- CHAPTER 11: BIT BY BIT BY BIT ---
export function Chapter11({ onComplete }) {
  const [binaryCount, setBinaryCount] = useState([0,0,0,0,0,0,0,0]); // 8-bit counter
  const [upcLines, setUpcLines] = useState([
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
          <button className="btn btn-secondary" onClick={decrementCounter}>-1</button>
          <div className="text-mono flex-center" style={{fontSize: '1.25rem', width: '80px', fontWeight: 'bold'}}>{countVal}</div>
          <button className="btn btn-secondary" onClick={incrementCounter}>+1</button>
        </div>
      </div>

      {/* UPC Barcode section */}
      <div className="glass-panel" style={{padding: '1.5rem'}}>
        <div style={{fontWeight: 700, marginBottom: '1rem', textAlign: 'center'}}>UPC-A Barcode Simulator</div>
        <div className="flex-center" style={{background: 'white', padding: '1rem', borderRadius: '4px', height: '100px', gap: '2px'}}>
          {upcLines.map((bar, idx) => (
            <div key={idx} style={{
              width: bar ? '4px' : '4px', 
              height: '80px', 
              background: bar ? 'black' : 'transparent'
            }}></div>
          ))}
        </div>
        <div className="flex-center" style={{marginTop: '1rem'}}>
          <button className="btn btn-primary" onClick={handleScan}>Scan Barcode</button>
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

// --- CHAPTER 12: BYTES AND HEXADECIMAL ---
export function Chapter12({ onComplete }) {
  const [byte, setByte] = useState([0,0,0,0,0,0,0,0]);

  const toggleBit = (idx) => {
    const nextByte = [...byte];
    nextByte[idx] = nextByte[idx] ? 0 : 1;
    setByte(nextByte);

    // Check challenge: Hex A5 = binary 10100101 = decimal 165
    const val = parseInt(nextByte.join(''), 2);
    if (val === 165) {
      onComplete(true);
    } else {
      onComplete(false);
    }
  };

  const getHexValue = () => {
    const highNibble = parseInt(byte.slice(0, 4).join(''), 2).toString(16).toUpperCase();
    const lowNibble = parseInt(byte.slice(4, 8).join(''), 2).toString(16).toUpperCase();
    return highNibble + lowNibble;
  };

  const getDecimalValue = () => {
    return parseInt(byte.join(''), 2);
  };

  const handleSetHexChallenge = () => {
    // Quick helper to auto-complete or let them set it
    setByte([1,0,1,0,0,1,0,1]); // Set A5
    onComplete(true);
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      {/* 8 Bits togglers grouped in nibbles */}
      <div className="flex-row" style={{gap: '2rem'}}>
        {/* High Nibble */}
        <div className="glass-panel flex-column" style={{padding: '1rem', alignItems: 'center', borderColor: 'var(--color-purple)'}}>
          <div style={{fontSize: '0.75rem', color: 'var(--color-purple)', fontWeight: 700}}>HIGH NIBBLE</div>
          <div className="flex-row" style={{gap: '0.4rem'}}>
            {[0,1,2,3].map(idx => (
              <button 
                key={idx} 
                className="text-mono" 
                style={{
                  width: '32px', 
                  height: '32px', 
                  background: byte[idx] ? 'var(--color-purple)' : '#111827', 
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onClick={() => toggleBit(idx)}
              >
                {byte[idx]}
              </button>
            ))}
          </div>
        </div>

        {/* Low Nibble */}
        <div className="glass-panel flex-column" style={{padding: '1rem', alignItems: 'center', borderColor: 'var(--color-cyan)'}}>
          <div style={{fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 700}}>LOW NIBBLE</div>
          <div className="flex-row" style={{gap: '0.4rem'}}>
            {[4,5,6,7].map(idx => (
              <button 
                key={idx} 
                className="text-mono" 
                style={{
                  width: '32px', 
                  height: '32px', 
                  background: byte[idx] ? 'var(--color-cyan)' : '#111827', 
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onClick={() => toggleBit(idx)}
              >
                {byte[idx]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-3" style={{width: '100%', maxWidth: '500px'}}>
        <div className="glass-card text-mono" style={{textAlign: 'center'}}>
          <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>Hexadecimal</div>
          <div style={{fontSize: '1.75rem', color: 'var(--color-pink)', fontWeight: 'bold', marginTop: '0.5rem'}}>0x{getHexValue()}</div>
        </div>
        <div className="glass-card text-mono" style={{textAlign: 'center'}}>
          <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>Unsigned Dec</div>
          <div style={{fontSize: '1.75rem', color: 'var(--color-emerald)', fontWeight: 'bold', marginTop: '0.5rem'}}>{getDecimalValue()}</div>
        </div>
        <div className="glass-card text-mono" style={{textAlign: 'center'}}>
          <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>Signed (2's)</div>
          <div style={{fontSize: '1.75rem', color: 'var(--color-amber)', fontWeight: 'bold', marginTop: '0.5rem'}}>
            {getDecimalValue() >= 128 ? getDecimalValue() - 256 : getDecimalValue()}
          </div>
        </div>
      </div>

      <button className="btn btn-secondary" onClick={handleSetHexChallenge}>Solve Instantly (Set A5)</button>
    </div>
  );
}

// --- CHAPTER 13: FROM ASCII TO UNICODE ---
export function Chapter13({ onComplete }) {
  const [inputText, setInputText] = useState('');

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);
    if (val === 'CODE') {
      onComplete(true);
    } else {
      onComplete(false);
    }
  };

  const getBytesOutput = () => {
    if (!inputText) return '';
    const bytes = [];
    for (let i = 0; i < inputText.length; i++) {
      bytes.push(inputText.charCodeAt(i).toString(16).toUpperCase().padStart(2, '0'));
    }
    return bytes.join(' ');
  };

  const getBinaryOutput = () => {
    if (!inputText) return '';
    const bits = [];
    for (let i = 0; i < inputText.length; i++) {
      bits.push(inputText.charCodeAt(i).toString(2).padStart(8, '0'));
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
          style={{background: '#090d16', border: '1px solid #1f2937', padding: '0.75rem 1rem', width: '100%', color: 'white', textAlign: 'center', fontSize: '1.2rem'}}
          placeholder="Type here..." 
          value={inputText}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex-column" style={{width: '100%', maxWidth: '480px', gap: '1rem'}}>
        <div className="glass-card text-mono">
          <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>ASCII Hex Bytes</div>
          <div style={{fontSize: '1.2rem', color: 'var(--color-pink)', fontWeight: 'bold', marginTop: '0.5rem', wordBreak: 'break-all'}}>{getBytesOutput() || '(empty)'}</div>
        </div>
        <div className="glass-card text-mono">
          <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>ASCII Binary Bits</div>
          <div style={{fontSize: '1rem', color: 'var(--color-cyan)', fontWeight: 'bold', marginTop: '0.5rem', wordBreak: 'break-all'}}>{getBinaryOutput() || '(empty)'}</div>
        </div>
      </div>
    </div>
  );
}

// --- CHAPTER 14: ADDING WITH LOGIC GATES ---
export function Chapter14({ onComplete }) {
  const [inA, setInA] = useState(false);
  const [inB, setInB] = useState(false);
  const [inCin, setInCin] = useState(false);

  // Math logic
  const sum1 = inA !== inB;
  const carry1 = inA && inB;
  
  const sumOut = sum1 !== inCin;
  const carry2 = sum1 && inCin;
  
  const carryOut = carry1 || carry2;

  useEffect(() => {
    // Challenge target: A=1, B=1, Cin=0, output Sum=0, Cout=1
    if (inA && inB && !inCin && !sumOut && carryOut) {
      onComplete(true);
    } else {
      onComplete(false);
    }
  }, [inA, inB, inCin, sumOut, carryOut]);

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <div className="flex-row" style={{gap: '1.5rem'}}>
        <div className="switch-control" onClick={() => setInA(!inA)}>
          <span className="switch-label">Input A</span>
          <div className={`switch-toggle ${inA ? 'on' : ''}`}>
            <div className="switch-toggle-handle"></div>
          </div>
        </div>
        <div className="switch-control" onClick={() => setInB(!inB)}>
          <span className="switch-label">Input B</span>
          <div className={`switch-toggle ${inB ? 'on' : ''}`}>
            <div className="switch-toggle-handle"></div>
          </div>
        </div>
        <div className="switch-control" onClick={() => setInCin(!inCin)}>
          <span className="switch-label">Carry In (Cin)</span>
          <div className={`switch-toggle ${inCin ? 'on' : ''}`}>
            <div className="switch-toggle-handle"></div>
          </div>
        </div>
      </div>

      <svg width="460" height="200" viewBox="0 0 460 200" style={{background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
        {/* Schematic drawing of adders block */}
        <rect x="150" y="50" width="160" height="100" rx="6" fill="#1e293b" stroke="white" strokeWidth="2" />
        <text x="195" y="105" fill="white" fontSize="16" fontFamily="sans-serif" fontWeight="bold">FULL ADDER</text>

        {/* Inputs */}
        <line x1="40" y1="70" x2="150" y2="70" stroke={inA ? "var(--color-cyan)" : "#4b5563"} strokeWidth="3" />
        <text x="50" y="62" fill="white" fontSize="12">A = {inA ? '1' : '0'}</text>

        <line x1="40" y1="100" x2="150" y2="100" stroke={inB ? "var(--color-cyan)" : "#4b5563"} strokeWidth="3" />
        <text x="50" y="92" fill="white" fontSize="12">B = {inB ? '1' : '0'}</text>

        <line x1="40" y1="130" x2="150" y2="130" stroke={inCin ? "var(--color-cyan)" : "#4b5563"} strokeWidth="3" />
        <text x="50" y="122" fill="white" fontSize="12">Cin = {inCin ? '1' : '0'}</text>

        {/* Outputs */}
        <line x1="310" y1="75" x2="420" y2="75" stroke={sumOut ? "var(--color-emerald)" : "#4b5563"} strokeWidth="3" />
        <text x="370" y="67" fill="white" fontSize="12">Sum = {sumOut ? '1' : '0'}</text>
        <circle cx="420" cy="75" r="5" fill={sumOut ? "var(--color-emerald)" : "#4b5563"} />

        <line x1="310" y1="125" x2="420" y2="125" stroke={carryOut ? "var(--color-pink)" : "#4b5563"} strokeWidth="3" />
        <text x="360" y="117" fill="white" fontSize="12">Carry Out = {carryOut ? '1' : '0'}</text>
        <circle cx="420" cy="125" r="5" fill={carryOut ? "var(--color-pink)" : "#4b5563"} />
      </svg>
    </div>
  );
}
