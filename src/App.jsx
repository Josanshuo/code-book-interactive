import React, { useState, useEffect } from 'react';
import { 
  Zap, CheckCircle2, AlertCircle, HelpCircle, 
  BookOpen, Trophy, Compass, Code as CodeIcon
} from 'lucide-react';
import { chaptersData } from './data/chaptersData';

// Import labs from Part 1
import { 
  Chapter1, Chapter2, Chapter3, Chapter4, Chapter5, 
  Chapter6, Chapter7, Chapter8, Chapter9, Chapter10, 
  Chapter11, Chapter12, Chapter13, Chapter14 
} from './components/ChapterLabsPart1';

// Import labs from Part 2
import { 
  Chapter15, Chapter16, Chapter17, Chapter18, Chapter19, 
  Chapter20, Chapter21, Chapter22, Chapter23, Chapter24, 
  Chapter25, Chapter26, Chapter27, Chapter28 
} from './components/ChapterLabsPart2';

// Map chapter numbers to components
const labsMap = {
  1: Chapter1,
  2: Chapter2,
  3: Chapter3,
  4: Chapter4,
  5: Chapter5,
  6: Chapter6,
  7: Chapter7,
  8: Chapter8,
  9: Chapter9,
  10: Chapter10,
  11: Chapter11,
  12: Chapter12,
  13: Chapter13,
  14: Chapter14,
  15: Chapter15,
  16: Chapter16,
  17: Chapter17,
  18: Chapter18,
  19: Chapter19,
  20: Chapter20,
  21: Chapter21,
  22: Chapter22,
  23: Chapter23,
  24: Chapter24,
  25: Chapter25,
  26: Chapter26,
  27: Chapter27,
  28: Chapter28
};

function App() {
  const [activeChapterNum, setActiveChapterNum] = useState(1);
  const [completedChapters, setCompletedChapters] = useState(() => {
    try {
      const saved = localStorage.getItem('completed_chapters');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [showHint, setShowHint] = useState(false);

  // Sync completed chapters to localstorage
  useEffect(() => {
    localStorage.setItem('completed_chapters', JSON.stringify(completedChapters));
  }, [completedChapters]);

  const activeChapter = chaptersData.find(c => c.num === activeChapterNum) || chaptersData[0];
  const LabComponent = labsMap[activeChapterNum];

  const handleChapterComplete = (isSuccess) => {
    setCompletedChapters(prev => {
      const next = { ...prev };
      if (isSuccess) {
        next[activeChapterNum] = true;
      } else {
        delete next[activeChapterNum];
      }
      return next;
    });
  };

  const completedCount = Object.keys(completedChapters).length;
  const progressPercent = Math.round((completedCount / chaptersData.length) * 100);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <header className="sidebar-header">
          <Zap size={24} color="var(--color-cyan)" style={{filter: 'drop-shadow(0 0 8px var(--color-cyan-glow))'}} />
          <h1 className="sidebar-logo">CODE LABS</h1>
        </header>

        {/* Progress Bar */}
        <div style={{padding: '1rem 1.5rem', borderBottom: 'var(--border-glass)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>
            <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}><Trophy size={12} /> Progress</span>
            <span>{completedCount} / {chaptersData.length} ({progressPercent}%)</span>
          </div>
          <div style={{height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, var(--color-cyan) 0%, var(--color-purple) 100%)', transition: 'width 0.3s ease'}}></div>
          </div>
        </div>

        <nav className="sidebar-chapters">
          {chaptersData.map((ch) => {
            const isCompleted = !!completedChapters[ch.num];
            const isActive = ch.num === activeChapterNum;
            return (
              <button 
                key={ch.num} 
                className={`chapter-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveChapterNum(ch.num);
                  setShowHint(false);
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                  <span className="chapter-num">Chapter {ch.num}</span>
                  {isCompleted && <CheckCircle2 size={14} color="var(--color-emerald)" />}
                </div>
                <span className="chapter-title">{ch.title}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Workspace */}
      <main className="main-content">
        <header className="app-header">
          <div className="header-chapter-info">
            <span className="header-chapter-num">CHAPTER {activeChapter.num}</span>
            <h2 className="header-chapter-title">{activeChapter.title}</h2>
          </div>
          <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
            <BookOpen size={18} color="var(--text-secondary)" />
            <span style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Charles Petzold Companion</span>
          </div>
        </header>

        <div className="workspace">
          {/* Left Panel: Info, Summary and Challenge */}
          <section className="left-panel glass-panel" style={{padding: '1.5rem'}}>
            <div className="panel-title"><Compass size={16} /> Concept Overview</div>
            <div className="summary-text">
              <p>{activeChapter.summary}</p>
            </div>

            <div className={`challenge-box ${completedChapters[activeChapterNum] ? 'success' : ''}`}>
              <div className="challenge-header">
                {completedChapters[activeChapterNum] ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Challenge Completed!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} />
                    <span>Active Challenge</span>
                  </>
                )}
              </div>
              <p className="challenge-desc">{activeChapter.challenge}</p>
              
              <div style={{marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <button 
                  className="btn btn-secondary" 
                  style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem', alignSelf: 'flex-start'}}
                  onClick={() => setShowHint(!showHint)}
                >
                  <HelpCircle size={12} /> {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                {showHint && (
                  <div style={{background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--color-amber)', lineHeight: '1.4'}}>
                    {activeChapter.hint}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right Panel: The Interactive Lab */}
          <section className="right-panel glass-panel">
            <div className="panel-title" style={{padding: '1rem 1.5rem 0.5rem 1.5rem', borderBottom: 'none'}}>
              <CodeIcon size={16} color="var(--color-cyan)" /> Interactive Simulator
            </div>
            {LabComponent ? (
              <LabComponent onComplete={handleChapterComplete} />
            ) : (
              <div className="flex-center" style={{flex: 1, color: 'var(--text-secondary)'}}>
                Simulator loading...
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
