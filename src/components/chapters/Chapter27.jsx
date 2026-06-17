import React, { useState } from 'react';

// --- CHAPTER 27: CODING (COMPILER) ---
export default function Chapter27({ onComplete }) {
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
      const val1 = parseInt(match[2], 10);
      const val2 = parseInt(match[3], 10);
      
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
          data-testid="ch27-code-input"
          type="text" 
          className="btn btn-secondary text-mono" 
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          style={{background: '#090d16', border: '1px solid #1f2937', padding: '0.75rem 1rem', width: '100%', color: 'white', fontSize: '1.1rem'}}
        />
        <button data-testid="ch27-compile-btn" className="btn btn-primary" onClick={handleCompile}>Compile Code</button>
      </div>

      <div className="grid-2">
        <div className="glass-card text-mono">
          <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem'}}>Compiled Assembly</div>
          <pre data-testid="ch27-assembly" style={{fontSize: '0.8rem', color: 'var(--color-cyan)', overflowX: 'auto'}}>{assembly}</pre>
        </div>
        <div className="glass-card text-mono">
          <div style={{color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem'}}>Machine Code (Hex Bytes)</div>
          <pre data-testid="ch27-machine-code" style={{fontSize: '1.25rem', color: 'var(--color-pink)', wordBreak: 'break-all'}}>{machineCode}</pre>
        </div>
      </div>
    </div>
  );
}
