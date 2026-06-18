import React, { useState, useEffect, useRef } from 'react';

// --- CHAPTER 28: THE WORLD BRAIN ---
export default function Chapter28({ onComplete }) {
  const [url, setUrl] = useState('');
  const [hops, setHops] = useState([]);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  // Cleanup interval on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

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
    intervalRef.current = setInterval(() => {
      if (currentHop < route.length) {
        setHops(prev => [...prev, route[currentHop]]);
        currentHop++;
      } else {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setLoading(false);
        onComplete(true);
      }
    }, 1200);
  };

  return (
    <div className="lab-container flex-column" style={{gap: '1.5rem'}}>
      <form onSubmit={handleGo} className="flex-row">
        <input 
          data-testid="ch28-url-input"
          type="text"
          inputMode="url"
          className="btn btn-secondary text-mono"
          placeholder="Enter URL e.g. petzold.com..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          style={{background: '#090d16', border: '1px solid #1f2937', padding: '0.75rem 1rem', flex: 1, color: 'white'}}
        />
        <button data-testid="ch28-request-btn" type="submit" className="btn btn-primary" disabled={loading}>Request</button>
      </form>

      <div className="glass-panel text-mono" style={{padding: '1.5rem', minHeight: '200px'}}>
        <div style={{fontWeight: 700, marginBottom: '0.75rem'}}>Network Trace Hops:</div>
        <div data-testid="ch28-hops" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
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
