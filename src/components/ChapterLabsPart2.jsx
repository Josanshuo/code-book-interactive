import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, HelpCircle, CheckCircle2, 
  XCircle, Cpu, Keyboard, Monitor, Network, Database
} from 'lucide-react';

// --- CHAPTER 15: IS THIS FOR REAL? (TTL CHIP BREADBOARD) ---
export function Chapter15({ onComplete }) {
  const [pin1, setPin1] = useState(0); // Input 1A
  const [pin2, setPin2] = useState(0); // Input 1B
  const [vcc, setVcc] = useState(false); // Pin 14
  const [gnd, setGnd] = useState(false); // Pin 7

  // Pin 3 (Output 1Y) is NAND of Pin 1 and Pin 2, IF VCC is high and GND is connected.
  const getPin3 = () => {
    if (!vcc || !gnd) return 0; // Chip needs power
    return !(pin1 && pin2) ? 1 : 0;
  };

  const output = getPin3();

  useEffect(() => {
    // Challenge target: Connect VCC (1), GND (1), set Pin1=1, Pin2=1, verify Output=0
    if (vcc && gnd && pin1 === 1 && pin2 === 1 && output === 0) {
      onComplete(true);
    } else {
      onComplete(false);
    }
  }, [pin1, pin2, vcc, gnd, output]);

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <div className="breadboard" style={{width: '100%', maxWidth: '500px'}}>
        <div style={{fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center'}}>SN7400 Quad 2-Input NAND Gate IC</div>
        
        {/* Chip drawing */}
        <div style={{background: '#111827', borderRadius: '4px', border: '2px solid #374151', padding: '1rem', position: 'relative', color: '#9ca3af', fontSize: '0.8rem'}}>
          <div style={{position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)', width: '8px', height: '16px', background: '#374151', borderTopRightRadius: '8px', borderBottomRightRadius: '8px'}}></div>
          
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
            <span style={{color: vcc ? 'var(--color-emerald)' : '#ef4444'}}>Pin 14: VCC</span>
            <span>Pin 13: 4B</span>
            <span>Pin 12: 4A</span>
            <span>Pin 11: 4Y</span>
          </div>

          <div className="flex-center" style={{margin: '1rem 0', color: 'white', fontWeight: 'bold'}}>
            7400 NAND
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '2rem'}}>
            <span style={{color: pin1 ? 'var(--color-cyan)' : 'white'}}>Pin 1: 1A</span>
            <span style={{color: pin2 ? 'var(--color-cyan)' : 'white'}}>Pin 2: 1B</span>
            <span style={{color: output ? 'var(--color-emerald)' : '#ef4444'}}>Pin 3: 1Y</span>
            <span style={{color: gnd ? 'var(--color-emerald)' : '#ef4444'}}>Pin 7: GND</span>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{width: '100%', maxWidth: '500px'}}>
        <div className="glass-panel flex-column" style={{padding: '1rem', gap: '0.5rem'}}>
          <div style={{fontWeight: 700}}>Power Connections:</div>
          <button className={`btn ${vcc ? 'btn-success' : 'btn-secondary'}`} onClick={() => setVcc(!vcc)}>
            Pin 14 VCC (5V): {vcc ? 'CONNECTED' : 'DISCONNECTED'}
          </button>
          <button className={`btn ${gnd ? 'btn-success' : 'btn-secondary'}`} onClick={() => setGnd(!gnd)}>
            Pin 7 GND: {gnd ? 'CONNECTED' : 'DISCONNECTED'}
          </button>
        </div>
        
        <div className="glass-panel flex-column" style={{padding: '1rem', gap: '0.5rem'}}>
          <div style={{fontWeight: 700}}>NAND Gate 1 Inputs:</div>
          <button className={`btn ${pin1 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setPin1(pin1 ? 0 : 1)}>
            Pin 1 Input A: {pin1}
          </button>
          <button className={`btn ${pin2 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setPin2(pin2 ? 0 : 1)}>
            Pin 2 Input B: {pin2}
          </button>
        </div>
      </div>

      <div className="glass-card text-mono" style={{width: '100%', maxWidth: '500px', textAlign: 'center'}}>
        Output Pin 3 (1Y) LED = <span style={{color: output ? 'var(--color-emerald)' : 'var(--color-ruby)', fontWeight: 'bold'}}>{output ? 'HIGH (1)' : 'LOW (0)'}</span>
      </div>
    </div>
  );
}

// --- CHAPTER 16: BUT WHAT ABOUT SUBTRACTION? ---
export function Chapter16({ onComplete }) {
  const [valA, setValA] = useState(12);
  const [valB, setValB] = useState(5);
  const [isSubtract, setIsSubtract] = useState(false);

  const getBinary = (val) => {
    return (val & 0xFF).toString(2).padStart(8, '0');
  };

  // 2's complement subtraction:
  // Output = A + (~B) + Cin (where Cin is 1 if subtracting)
  const carryIn = isSubtract ? 1 : 0;
  const operandB = isSubtract ? (~valB & 0xFF) : valB;
  const result = (valA + operandB + carryIn) & 0xFF;

  useEffect(() => {
    // Challenge target: valA = 12, valB = 5, isSubtract = true, result = 7
    if (valA === 12 && valB === 5 && isSubtract && result === 7) {
      onComplete(true);
    } else {
      onComplete(false);
    }
  }, [valA, valB, isSubtract, result]);

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <div className="grid-2" style={{width: '100%', maxWidth: '500px'}}>
        <div className="glass-panel flex-column" style={{padding: '1rem'}}>
          <label>Operand A (Decimal): <strong>{valA}</strong></label>
          <input type="range" min="0" max="100" value={valA} onChange={(e) => setValA(parseInt(e.target.value))} style={{width: '100%'}} />
          <span className="text-mono" style={{fontSize: '0.85rem', color: 'var(--color-cyan)', marginTop: '0.5rem'}}>{getBinary(valA)}</span>
        </div>
        <div className="glass-panel flex-column" style={{padding: '1rem'}}>
          <label>Operand B (Decimal): <strong>{valB}</strong></label>
          <input type="range" min="0" max="100" value={valB} onChange={(e) => setValB(parseInt(e.target.value))} style={{width: '100%'}} />
          <span className="text-mono" style={{fontSize: '0.85rem', color: 'var(--color-cyan)', marginTop: '0.5rem'}}>{getBinary(valB)}</span>
        </div>
      </div>

      <div className="flex-row">
        <button className={`btn ${isSubtract ? 'btn-danger' : 'btn-secondary'}`} onClick={() => setIsSubtract(true)}>
          SUBTRACT MODE
        </button>
        <button className={`btn ${!isSubtract ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setIsSubtract(false)}>
          ADD MODE
        </button>
      </div>

      <div className="glass-card text-mono" style={{width: '100%', maxWidth: '500px'}}>
        <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Calculations:</div>
        <div>  A: {getBinary(valA)} ({valA})</div>
        <div>{isSubtract ? '-' : '+'} B: {getBinary(operandB)} ({isSubtract ? `1's Comp of ${valB}` : valB})</div>
        {isSubtract && <div>+ Carry In: 1 (adds 1 to make 2's Complement)</div>}
        <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '0.5rem', paddingTop: '0.5rem', fontWeight: 'bold'}}>
          Result: {getBinary(result)} ({result})
        </div>
      </div>
    </div>
  );
}

// --- CHAPTER 17: FEEDBACK AND FLIP-FLOOPS ---
export function Chapter17({ onComplete }) {
  const [data, setData] = useState(false);
  const [clk, setClk] = useState(false);
  const [latchQ, setLatchQ] = useState(false); // Output state of D flip-flop

  const pulseClock = () => {
    setClk(true);
    setLatchQ(data); // Capture D value on positive edge
    setTimeout(() => {
      setClk(false);
    }, 150);
  };

  useEffect(() => {
    // Challenge target: store a 1 in D flip-flop (latchQ = true)
    if (latchQ) {
      onComplete(true);
    } else {
      onComplete(false);
    }
  }, [latchQ]);

  const resetLab = () => {
    setData(false);
    setClk(false);
    setLatchQ(false);
    onComplete(false);
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <div className="flex-row">
        <div className="switch-control" onClick={() => setData(!data)}>
          <span className="switch-label">Data (D)</span>
          <div className={`switch-toggle ${data ? 'on' : ''}`}>
            <div className="switch-toggle-handle"></div>
          </div>
        </div>
        <button className="btn btn-primary" onClick={pulseClock}>
          CLK Pulse (CLK)
        </button>
      </div>

      <svg width="400" height="180" viewBox="0 0 400 180" style={{background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
        {/* Flip Flop Chip representation */}
        <rect x="120" y="30" width="160" height="120" rx="6" fill="#1e293b" stroke="white" strokeWidth="2" />
        <text x="145" y="100" fill="white" fontSize="16" fontFamily="monospace" fontWeight="bold">D FLIP-FLOP</text>

        {/* Inputs */}
        <line x1="40" y1="60" x2="120" y2="60" stroke={data ? "var(--color-cyan)" : "#4b5563"} strokeWidth="3" />
        <text x="50" y="52" fill="white" fontSize="12">D = {data ? '1' : '0'}</text>

        <line x1="40" y1="120" x2="120" y2="120" stroke={clk ? "var(--color-purple)" : "#4b5563"} strokeWidth="3" />
        <text x="50" y="112" fill="white" fontSize="12">CLK = {clk ? '1' : '0'}</text>

        {/* Output */}
        <line x1="280" y1="90" x2="360" y2="90" stroke={latchQ ? "var(--color-emerald)" : "#4b5563"} strokeWidth="3" />
        <text x="300" y="82" fill="white" fontSize="12">Q = {latchQ ? '1' : '0'}</text>
        <circle cx="360" cy="90" r="6" fill={latchQ ? "var(--color-emerald)" : "#4b5563"} />
      </svg>

      <button className="btn btn-secondary" onClick={resetLab}><RotateCcw size={16} /> Reset Latch</button>
    </div>
  );
}

// --- CHAPTER 18: LET'S BUILD A CLOCK! ---
export function Chapter18({ onComplete }) {
  const [freq, setFreq] = useState(1); // Hz
  const [isRunning, setIsRunning] = useState(false);
  const [count, setCount] = useState(0); // 4-bit counter (0-15)
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      const interval = 1000 / freq;
      timerRef.current = setInterval(() => {
        setCount(prev => {
          const next = (prev + 1) % 16;
          if (next === 7) {
            // target check
            onComplete(true);
          }
          return next;
        });
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
    onComplete(false);
  };

  const getBinaryString = () => {
    return count.toString(2).padStart(4, '0');
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <div className="flex-row">
        <button className={`btn ${isRunning ? 'btn-danger' : 'btn-success'}`} onClick={toggleRun}>
          {isRunning ? <Pause size={16} /> : <Play size={16} />} {isRunning ? 'Stop Clock' : 'Start Clock'}
        </button>
        <button className="btn btn-secondary" onClick={resetCounter}><RotateCcw size={16} /> Reset</button>
      </div>

      <div className="glass-panel flex-column" style={{padding: '1rem', width: '100%', maxWidth: '400px'}}>
        <label>Clock Frequency: <strong>{freq} Hz</strong></label>
        <input type="range" min="1" max="5" value={freq} onChange={(e) => setFreq(parseInt(e.target.value))} style={{width: '100%'}} />
      </div>

      <div className="grid-2" style={{width: '100%', maxWidth: '400px'}}>
        <div className="glass-card text-mono flex-center" style={{fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-pink)'}}>
          {count}
        </div>
        <div className="glass-card text-mono flex-center" style={{fontSize: '1.5rem', color: 'var(--color-cyan)'}}>
          {getBinaryString()}
        </div>
      </div>
    </div>
  );
}

// --- CHAPTER 19: AN ASSEMBLAGE OF MEMORY (RAM GRID) ---
export function Chapter19({ onComplete }) {
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
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(8, 30px)', gap: '4px', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)'}}>
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
          <input type="range" min="0" max="7" value={row} onChange={(e) => setRow(parseInt(e.target.value))} />
          <div>Address Col: <strong>{col}</strong></div>
          <input type="range" min="0" max="7" value={col} onChange={(e) => setCol(parseInt(e.target.value))} />
        </div>

        <div className="glass-panel flex-column" style={{padding: '1rem', gap: '0.75rem'}}>
          <button className={`btn ${writeEnable ? 'btn-danger' : 'btn-secondary'}`} onClick={() => setWriteEnable(!writeEnable)}>
            Write Enable (WE): {writeEnable ? 'ON' : 'OFF'}
          </button>
          
          <div className="flex-row" style={{justifyContent: 'center'}}>
            <button className={`btn ${dataIn === 1 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDataIn(1)}>Data 1</button>
            <button className={`btn ${dataIn === 0 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDataIn(0)}>Data 0</button>
          </div>
          
          <button className="btn btn-success" onClick={executeWrite}>Execute Write</button>
        </div>
      </div>
    </div>
  );
}

// --- CHAPTER 20: AUTOMATING ARITHMETIC ---
export function Chapter20({ onComplete }) {
  const [ram, setRam] = useState({ 10: 12, 11: 15, 12: 0 });
  const [acc, setAcc] = useState(0);
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
    const inst = instructions[stepIndex];
    if (stepIndex === 0) {
      setAcc(ram[10]);
      setLog(prev => [...prev, `LOD A, [10] -> ACC loaded with ${ram[10]}`]);
    } else if (stepIndex === 1) {
      setAcc(prev => {
        const next = prev + ram[11];
        setLog(logPrev => [...logPrev, `ADD A, [11] -> ACC added with ${ram[11]} (New ACC: ${next})`]);
        return next;
      });
    } else if (stepIndex === 2) {
      setRam(prev => {
        const next = { ...prev, 12: acc };
        setLog(logPrev => [...logPrev, `STO [12], A -> Address 12 stored with ACC value ${acc}`]);
        // Challenge complete when sum of 12 and 15 (27) is stored at address 12
        if (acc === 27) {
          onComplete(true);
        }
        return next;
      });
    }
    setPc(prev => prev + 1);
    setStepIndex(prev => prev + 1);
  };

  const resetProgram = () => {
    setRam({ 10: 12, 11: 15, 12: 0 });
    setAcc(0);
    setPc(0);
    setStepIndex(0);
    setLog([]);
    onComplete(false);
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem'}}>
      <div className="flex-row">
        <button className="btn btn-primary" onClick={stepProgram} disabled={stepIndex >= instructions.length}>
          Step Instruction ({stepIndex < instructions.length ? instructions[stepIndex].op : 'HALTED'})
        </button>
        <button className="btn btn-secondary" onClick={resetProgram}><RotateCcw size={16} /> Reset</button>
      </div>

      <div className="grid-3">
        <div className="glass-card text-mono">
          <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>RAM State</div>
          <div style={{marginTop: '0.5rem'}}>Address 10: {ram[10]}</div>
          <div>Address 11: {ram[11]}</div>
          <div>Address 12: <span style={{color: ram[12] === 27 ? 'var(--color-emerald)' : 'var(--color-cyan)', fontWeight: 'bold'}}>{ram[12]}</span></div>
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

// --- CHAPTER 21: THE ARITHMETIC LOGIC UNIT (ALU) ---
export function Chapter21({ onComplete }) {
  const [valA, setValA] = useState('10101010'); // binary A
  const [valB, setValB] = useState('00001111'); // binary B
  const [mode, setMode] = useState('ADD');

  const operations = ['ADD', 'SUB', 'AND', 'OR', 'XOR'];

  const getResult = () => {
    const numA = parseInt(valA, 2);
    const numB = parseInt(valB, 2);
    let res = 0;
    switch(mode) {
      case 'ADD': res = (numA + numB) & 0xFF; break;
      case 'SUB': res = (numA - numB) & 0xFF; break;
      case 'AND': res = (numA & numB) & 0xFF; break;
      case 'OR':  res = (numA | numB) & 0xFF; break;
      case 'XOR': res = (numA ^ numB) & 0xFF; break;
      default: res = 0;
    }
    return res.toString(2).padStart(8, '0');
  };

  const resultStr = getResult();

  useEffect(() => {
    // Challenge target: XOR mode, valA = 10101010, valB = 00001111, resultStr = 10100101
    if (mode === 'XOR' && valA === '10101010' && valB === '00001111' && resultStr === '10100101') {
      onComplete(true);
    } else {
      onComplete(false);
    }
  }, [valA, valB, mode, resultStr]);

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      <div className="flex-row" style={{gap: '0.5rem', flexWrap: 'wrap'}}>
        {operations.map(op => (
          <button key={op} className={`btn ${mode === op ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode(op)}>
            {op}
          </button>
        ))}
      </div>

      <div className="grid-2" style={{width: '100%', maxWidth: '500px'}}>
        <div className="glass-panel flex-column" style={{padding: '1rem'}}>
          <label>Operand A (8-bit binary):</label>
          <input 
            type="text" 
            className="btn btn-secondary text-mono" 
            value={valA} 
            onChange={(e) => setValA(e.target.value.replace(/[^01]/g, '').slice(0, 8))} 
          />
        </div>
        <div className="glass-panel flex-column" style={{padding: '1rem'}}>
          <label>Operand B (8-bit binary):</label>
          <input 
            type="text" 
            className="btn btn-secondary text-mono" 
            value={valB} 
            onChange={(e) => setValB(e.target.value.replace(/[^01]/g, '').slice(0, 8))} 
          />
        </div>
      </div>

      <div className="glass-card text-mono" style={{width: '100%', maxWidth: '500px', textAlign: 'center'}}>
        <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>ALU Output (8-bit):</div>
        <div style={{fontSize: '2rem', color: 'var(--color-pink)', fontWeight: 'bold', margin: '0.5rem 0'}}>{resultStr}</div>
        <div style={{fontSize: '1rem', color: 'var(--color-emerald)'}}>= {parseInt(resultStr, 2)} (Decimal)</div>
      </div>
    </div>
  );
}

// --- CHAPTER 22: REGISTERS AND BUSSES ---
export function Chapter22({ onComplete }) {
  const [bus, setBus] = useState(0);
  const [regA, setRegA] = useState(85); // Initial state
  const [regB, setRegB] = useState(0);
  const [regC, setRegC] = useState(0);
  const [oeA, setOeA] = useState(false);
  const [oeB, setOeB] = useState(false);
  const [oeC, setOeC] = useState(false);
  const [ldA, setLdA] = useState(false);
  const [ldB, setLdB] = useState(false);
  const [ldC, setLdC] = useState(false);
  const [busContention, setBusContention] = useState(false);

  // Compute bus state depending on Output Enable signals
  useEffect(() => {
    const activeOutputs = [oeA, oeB, oeC].filter(Boolean).length;
    if (activeOutputs > 1) {
      setBusContention(true);
      setBus('ERR');
    } else {
      setBusContention(false);
      if (oeA) setBus(regA);
      else if (oeB) setBus(regB);
      else if (oeC) setBus(regC);
      else setBus(0);
    }
  }, [oeA, oeB, oeC, regA, regB, regC]);

  const clockPulse = () => {
    if (busContention || bus === 'ERR') return;
    if (ldA) setRegA(bus);
    if (ldB) setRegB(bus);
    if (ldC) {
      setRegC(bus);
      // Challenge target: Move 85 from A to C
      if (bus === 85) {
        onComplete(true);
      }
    }
  };

  const resetBusses = () => {
    setBus(0);
    setRegA(85);
    setRegB(0);
    setRegC(0);
    setOeA(false);
    setOeB(false);
    setOeC(false);
    setLdA(false);
    setLdB(false);
    setLdC(false);
    onComplete(false);
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem', alignItems: 'center'}}>
      {/* Visual Bus line */}
      <div className="glass-card text-mono flex-center" style={{width: '100%', maxWidth: '500px', height: '50px', background: busContention ? 'var(--color-ruby-glow)' : 'rgba(0,0,0,0.4)', borderColor: busContention ? 'var(--color-ruby)' : 'var(--color-cyan)', borderWidth: '2px'}}>
        {busContention ? (
          <span style={{color: 'var(--color-ruby)', fontWeight: 'bold'}}>⚠️ BUS CONTENTION SHORT CIRCUIT!</span>
        ) : (
          <span>SHARED DATA BUS = <strong style={{color: 'var(--color-cyan)', fontSize: '1.25rem'}}>{bus}</strong></span>
        )}
      </div>

      <div className="grid-3" style={{width: '100%', maxWidth: '500px'}}>
        {/* Register A */}
        <div className="glass-panel flex-column" style={{padding: '1rem', alignItems: 'center'}}>
          <div style={{fontWeight: 700}}>Reg A: {regA}</div>
          <button className={`btn btn-secondary ${oeA ? 'btn-primary' : ''}`} onClick={() => setOeA(!oeA)}>OE (Out)</button>
          <button className={`btn btn-secondary ${ldA ? 'btn-success' : ''}`} onClick={() => setLdA(!ldA)}>LD (In)</button>
        </div>

        {/* Register B */}
        <div className="glass-panel flex-column" style={{padding: '1rem', alignItems: 'center'}}>
          <div style={{fontWeight: 700}}>Reg B: {regB}</div>
          <button className={`btn btn-secondary ${oeB ? 'btn-primary' : ''}`} onClick={() => setOeB(!oeB)}>OE (Out)</button>
          <button className={`btn btn-secondary ${ldB ? 'btn-success' : ''}`} onClick={() => setLdB(!ldB)}>LD (In)</button>
        </div>

        {/* Register C */}
        <div className="glass-panel flex-column" style={{padding: '1rem', alignItems: 'center'}}>
          <div style={{fontWeight: 700}}>Reg C: {regC}</div>
          <button className={`btn btn-secondary ${oeC ? 'btn-primary' : ''}`} onClick={() => setOeC(!oeC)}>OE (Out)</button>
          <button className={`btn btn-secondary ${ldC ? 'btn-success' : ''}`} onClick={() => setLdC(!ldC)}>LD (In)</button>
        </div>
      </div>

      <div className="flex-row">
        <button className="btn btn-primary" onClick={clockPulse} disabled={busContention}>CLK PULSE</button>
        <button className="btn btn-secondary" onClick={resetBusses}><RotateCcw size={16} /> Reset</button>
      </div>
    </div>
  );
}

// --- CHAPTER 23: CPU CONTROL SIGNALS ---
export function Chapter23({ onComplete }) {
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
          <button className="btn btn-primary" onClick={handleStep}>Step Cycle</button>
        </div>
        <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem'}}>{steps[step].desc}</p>
        
        <div style={{borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem'}}>
          <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>Active Control ROM Signals:</div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
            {steps[step].activeSig.map(sig => (
              <span key={sig} style={{background: 'rgba(255, 46, 147, 0.15)', color: 'var(--color-pink)', border: '1px solid rgba(255, 46, 147, 0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'}}>{sig}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CHAPTER 24: LOOPS, JUMPS, AND CALLS ---
export function Chapter24({ onComplete }) {
  const [pc, setPc] = useState(0);
  const [regA, setRegA] = useState(3);
  const [halted, setHalted] = useState(false);
  const [running, setRunning] = useState(false);

  const code = [
    { label: "00", inst: "LOD A, 3", desc: "Load 3 into Register A" },
    { label: "01", inst: "DEC A", desc: "Decrement A by 1" },
    { label: "02", inst: "JNZ 01", desc: "Jump to 01 if Zero Flag is not set (A != 0)" },
    { label: "03", inst: "HLT", desc: "Halt processor" }
  ];

  useEffect(() => {
    let timer;
    if (running && !halted) {
      timer = setTimeout(() => {
        stepProgram();
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [running, pc, regA, halted]);

  const stepProgram = () => {
    if (pc === 0) {
      setRegA(3);
      setPc(1);
    } else if (pc === 1) {
      setRegA(prev => prev - 1);
      setPc(2);
    } else if (pc === 2) {
      if (regA !== 0) {
        setPc(1);
      } else {
        setPc(3);
      }
    } else if (pc === 3) {
      setHalted(true);
      setRunning(false);
      if (regA === 0) {
        onComplete(true);
      }
    }
  };

  const handleRun = () => {
    setRunning(true);
    setHalted(false);
  };

  const handleReset = () => {
    setPc(0);
    setRegA(3);
    setHalted(false);
    setRunning(false);
    onComplete(false);
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem'}}>
      <div className="flex-row">
        <button className="btn btn-primary" onClick={handleRun} disabled={running || halted}>Run Loop</button>
        <button className="btn btn-secondary" onClick={stepProgram} disabled={running || halted}>Step Code</button>
        <button className="btn btn-secondary" onClick={handleReset}><RotateCcw size={16} /> Reset</button>
      </div>

      <div className="grid-2">
        {/* Assembly Code Listing */}
        <div className="glass-panel flex-column" style={{padding: '1rem'}}>
          <div style={{fontWeight: 700, marginBottom: '0.5rem'}}>Program memory</div>
          {code.map((line, idx) => (
            <div key={idx} style={{
              display: 'flex', 
              gap: '1rem', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.85rem', 
              padding: '0.3rem', 
              borderRadius: '4px',
              background: pc === idx ? 'rgba(0,242,254,0.1)' : 'transparent',
              color: pc === idx ? 'var(--color-cyan)' : 'inherit',
              border: pc === idx ? '1px solid rgba(0,242,254,0.2)' : '1px solid transparent'
            }}>
              <span style={{color: 'var(--text-muted)'}}>{line.label}</span>
              <span style={{fontWeight: 'bold', width: '80px'}}>{line.inst}</span>
              <span style={{color: 'var(--text-secondary)'}}>; {line.desc}</span>
            </div>
          ))}
        </div>

        {/* Registers */}
        <div className="glass-panel flex-column" style={{padding: '1rem', gap: '0.5rem'}}>
          <div style={{fontWeight: 700}}>CPU registers</div>
          <div className="text-mono">Program Counter (PC): <strong>{pc}</strong></div>
          <div className="text-mono">Register A: <strong style={{color: 'var(--color-pink)'}}>{regA}</strong></div>
          <div className="text-mono">Zero Flag (ZF): <strong>{regA === 0 ? '1' : '0'}</strong></div>
          <div className="text-mono">Status: <strong style={{color: halted ? 'var(--color-ruby)' : 'var(--color-emerald)'}}>{halted ? 'HALTED' : running ? 'RUNNING' : 'IDLE'}</strong></div>
        </div>
      </div>
    </div>
  );
}

// --- CHAPTER 25: PERIPHERALS (VRAM / DISPLAY) ---
export function Chapter25({ onComplete }) {
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
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(16, 12px)', gap: '1px', background: 'black', border: '2px solid #374151', padding: '2px'}}>
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
            type="text" 
            className="btn btn-secondary text-mono" 
            placeholder="Type key here..." 
            onKeyDown={handleKeyPress}
            style={{background: '#090d16', border: '1px solid #1f2937', padding: '0.5rem', color: 'white', textAlign: 'center'}}
          />
          <div className="text-mono" style={{fontSize: '0.85rem'}}>
            Scan Code: <strong style={{color: 'var(--color-pink)'}}>{scanCode || 'None'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CHAPTER 26: THE OPERATING SYSTEM (SHELL CLI) ---
export function Chapter26({ onComplete }) {
  const [history, setHistory] = useState([
    { text: 'CodeOS v0.1 - Welcome', type: 'system' },
    { text: 'Type "help" to list available commands', type: 'system' }
  ]);
  const [input, setInput] = useState('');
  const terminalBottomRef = useRef(null);

  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, { text: `> ${input}`, type: 'input' }];

    if (cmd === 'help') {
      newHistory.push({ text: 'Available commands: help, dir, cat [file], clear', type: 'output' });
    } else if (cmd === 'dir') {
      newHistory.push({ text: 'Volume in drive C has no label.\nDirectory of C:\\\n\n17/06/2026  10:00 AM    <DIR>          ..\n17/06/2026  10:00 AM                32 readme.txt\n17/06/2026  10:00 AM                45 secret.txt', type: 'output' });
    } else if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else if (cmd === 'cat readme.txt') {
      newHistory.push({ text: 'Welcome to Petzold Companion OS. Explore computer engineering!', type: 'output' });
    } else if (cmd === 'cat secret.txt') {
      newHistory.push({ text: 'FLAG: CHARLES_PETZOLD_IS_AWESOME\nChallenge Complete!', type: 'output' });
      onComplete(true);
    } else if (cmd.startsWith('cat ')) {
      newHistory.push({ text: `cat: ${cmd.substring(4)}: File not found`, type: 'error' });
    } else {
      newHistory.push({ text: `Command not recognized: ${cmd}`, type: 'error' });
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1rem'}}>
      <div className="terminal-window">
        <div className="terminal-header">
          <span>CodeOS CLI Terminal</span>
          <span>Drive C:\\</span>
        </div>
        <div className="terminal-history">
          {history.map((line, idx) => (
            <div 
              key={idx} 
              style={{
                color: line.type === 'error' ? 'var(--color-ruby)' : line.type === 'system' ? 'var(--color-pink)' : line.type === 'input' ? 'white' : '#10b981',
                whiteSpace: 'pre-line'
              }}
            >
              {line.text}
            </div>
          ))}
          <div ref={terminalBottomRef}></div>
        </div>
        <form onSubmit={handleCommand} className="terminal-input-line">
          <span className="terminal-prompt">C:\&gt;</span>
          <input 
            type="text" 
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}

// --- CHAPTER 27: CODING (COMPILER) ---
export function Chapter27({ onComplete }) {
  const [code, setCode] = useState('a = 5 + 3;');
  const [ast, setAst] = useState(null);
  const [assembly, setAssembly] = useState('');
  const [machineCode, setMachineCode] = useState('');

  const handleCompile = () => {
    // Simple custom compiler parsing expression like a = X + Y;
    const clean = code.replace(/\s+/g, '');
    const match = clean.match(/^([a-zA-Z]+)=(\d+)\+(\d+);?$/);
    
    if (match) {
      const varName = match[1];
      const val1 = parseInt(match[2]);
      const val2 = parseInt(match[3]);
      
      // Generate fake AST
      setAst({
        type: "AssignmentExpression",
        left: { type: "Identifier", name: varName },
        right: {
          type: "BinaryExpression",
          operator: "+",
          left: { type: "Literal", value: val1 },
          right: { type: "Literal", value: val2 }
        }
      });

      // Generate Assembly
      const asm = `LOD A, ${val1}   ; Load ${val1} into Reg A\nADD A, ${val2}   ; Add ${val2} to Reg A\nSTO [${varName}], A ; Store result in ${varName}`;
      setAssembly(asm);

      // Generate Hex Machine Code Bytes
      const hex = `3A ${val1.toString(16).toUpperCase().padStart(2, '0')} 47 ${val2.toString(16).toUpperCase().padStart(2, '0')} 5C 10`;
      setMachineCode(hex);

      onComplete(true);
    } else {
      setAssembly("; Compiler Syntax Error!\nPlease input form 'a = 5 + 3;'");
      setMachineCode("ERROR");
      setAst(null);
      onComplete(false);
    }
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem'}}>
      <div className="glass-panel flex-column" style={{padding: '1.5rem', gap: '0.75rem'}}>
        <label>High-Level Code (JavaScript-like):</label>
        <input 
          type="text" 
          className="btn btn-secondary text-mono" 
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          style={{background: '#090d16', border: '1px solid #1f2937', padding: '0.75rem 1rem', width: '100%', color: 'white', fontSize: '1.1rem'}}
        />
        <button className="btn btn-primary" onClick={handleCompile}>Compile Code</button>
      </div>

      <div className="grid-2">
        <div className="glass-card text-mono">
          <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem'}}>Compiled Assembly</div>
          <pre style={{fontSize: '0.8rem', color: 'var(--color-cyan)', overflowX: 'auto'}}>{assembly}</pre>
        </div>
        <div className="glass-card text-mono">
          <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem'}}>Machine Code (Hex Bytes)</div>
          <pre style={{fontSize: '1.25rem', color: 'var(--color-pink)', wordBreak: 'break-all'}}>{machineCode}</pre>
        </div>
      </div>
    </div>
  );
}

// --- CHAPTER 28: THE WORLD BRAIN ---
export function Chapter28({ onComplete }) {
  const [url, setUrl] = useState('');
  const [hops, setHops] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGo = (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setHops([]);

    const route = [
      "Client PC: Requesting IP for " + url,
      "DNS Server: Resolved IP for " + url + " to 192.168.10.42",
      "Router 1 (Local Gateway): Routing packet...",
      "Router 2 (ISP backbone): Routing packet...",
      "Web Server (192.168.10.42): Received GET request",
      "Web Server: Returned HTTP/1.1 200 OK (HTML data)",
      "Client PC: Render complete!"
    ];

    let currentHop = 0;
    const interval = setInterval(() => {
      if (currentHop < route.length) {
        setHops(prev => [...prev, route[currentHop]]);
        currentHop++;
      } else {
        clearInterval(interval);
        setLoading(false);
        onComplete(true);
      }
    }, 1200);
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem'}}>
      <form onSubmit={handleGo} className="flex-row">
        <input 
          type="text" 
          className="btn btn-secondary text-mono" 
          placeholder="Enter URL e.g. petzold.com..." 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{background: '#090d16', border: '1px solid #1f2937', padding: '0.75rem 1rem', flex: 1, color: 'white'}}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>Request</button>
      </form>

      <div className="glass-panel text-mono" style={{padding: '1.5rem', minHeight: '200px'}}>
        <div style={{fontWeight: 700, marginBottom: '0.75rem'}}>Network Trace Hops:</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          {hops.map((hop, idx) => (
            <div key={idx} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem'}}>
              <span style={{color: 'var(--color-pink)'}}>[Step {idx+1}]</span>
              <span style={{color: idx === hops.length - 1 ? 'var(--color-emerald)' : 'var(--color-cyan)'}}>{hop}</span>
            </div>
          ))}
          {loading && <div className="electron-flow" style={{color: 'var(--color-pink)', fontSize: '0.85rem'}}>Transmitting packets...</div>}
        </div>
      </div>
    </div>
  );
}
