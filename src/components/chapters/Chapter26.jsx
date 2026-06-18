import React, { useState, useEffect, useRef } from 'react';

// --- CHAPTER 26: THE OPERATING SYSTEM (SHELL CLI) ---
export default function Chapter26({ onComplete }) {
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
        <div className="terminal-history" data-testid="ch26-history">
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
            data-testid="ch26-terminal-input"
            type="text"
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}
