import { useState, useEffect, useCallback } from 'react';
import {
  Zap, CheckCircle2, AlertCircle, HelpCircle,
  BookOpen, Trophy, Compass, Code as CodeIcon
} from 'lucide-react';
import { chaptersData } from './data/chaptersData';
import ErrorBoundary from './components/ErrorBoundary';

// Import labs from individual chapter files
import Chapter1 from './components/chapters/Chapter1';
import Chapter2 from './components/chapters/Chapter2';
import Chapter3 from './components/chapters/Chapter3';
import Chapter4 from './components/chapters/Chapter4';
import Chapter5 from './components/chapters/Chapter5';
import Chapter6 from './components/chapters/Chapter6';
import Chapter7 from './components/chapters/Chapter7';
import Chapter8 from './components/chapters/Chapter8';
import Chapter9 from './components/chapters/Chapter9';
import Chapter10 from './components/chapters/Chapter10';
import Chapter11 from './components/chapters/Chapter11';
import Chapter12 from './components/chapters/Chapter12';
import Chapter13 from './components/chapters/Chapter13';
import Chapter14 from './components/chapters/Chapter14';
import Chapter15 from './components/chapters/Chapter15';
import Chapter16 from './components/chapters/Chapter16';
import Chapter17 from './components/chapters/Chapter17';
import Chapter18 from './components/chapters/Chapter18';
import Chapter19 from './components/chapters/Chapter19';
import Chapter20 from './components/chapters/Chapter20';
import Chapter21 from './components/chapters/Chapter21';
import Chapter22 from './components/chapters/Chapter22';
import Chapter23 from './components/chapters/Chapter23';
import Chapter24 from './components/chapters/Chapter24';
import Chapter25 from './components/chapters/Chapter25';
import Chapter26 from './components/chapters/Chapter26';
import Chapter27 from './components/chapters/Chapter27';
import Chapter28 from './components/chapters/Chapter28';

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
      if (saved) {
        const parsed = JSON.parse(saved);
        return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
      }
      return {};
    } catch {
      return {};
    }
  });
  const [showHint, setShowHint] = useState(false);

  // Sync completed chapters to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('completed_chapters', JSON.stringify(completedChapters));
    } catch {
      // Silently fail if localStorage is full or disabled
    }
  }, [completedChapters]);

  const activeChapter = chaptersData.find(c => c.num === activeChapterNum) || chaptersData[0];
  const LabComponent = labsMap[activeChapterNum];

  // Memoize to avoid passing a new function reference on every render
  const handleChapterComplete = useCallback((isSuccess) => {
    setCompletedChapters(prev => {
      const next = { ...prev };
      if (isSuccess) {
        next[activeChapterNum] = true;
      } else {
        delete next[activeChapterNum];
      }
      return next;
    });
  }, [activeChapterNum]);

  const completedCount = Object.keys(completedChapters).length;
  const progressPercent = Math.round((completedCount / chaptersData.length) * 100);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar" aria-label="Chapter navigation">
        <header className="sidebar-header">
          <Zap size={24} color="var(--color-cyan)" style={{filter: 'drop-shadow(0 0 8px var(--color-cyan-glow))'}} />
          <h1 className="sidebar-logo">CODE LABS</h1>
        </header>

        {/* Progress Bar */}
        <div style={{padding: '1rem 1.5rem', borderBottom: 'var(--border-glass)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>
            <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}><Trophy size={12} /> Progress</span>
            <span data-testid="progress-text">{completedCount} / {chaptersData.length} ({progressPercent}%)</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Chapter completion progress"
            style={{height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden'}}
          >
            <div style={{height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, var(--color-cyan) 0%, var(--color-purple) 100%)', transition: 'width 0.3s ease'}}></div>
          </div>
        </div>

        <nav className="sidebar-chapters" aria-label="Chapter list">
          {chaptersData.map((ch) => {
            const isCompleted = !!completedChapters[ch.num];
            const isActive = ch.num === activeChapterNum;
            return (
              <button
                key={ch.num}
                className={`chapter-btn ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'true' : undefined}
                aria-label={`Chapter ${ch.num}: ${ch.title}${isCompleted ? ', completed' : ''}`}
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
      <main className="main-content" aria-label="Chapter workspace">
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

            <div className={`challenge-box ${completedChapters[activeChapterNum] ? 'success' : ''}`} data-testid="challenge-box">
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
                  aria-expanded={showHint}
                  data-testid="hint-toggle-btn"
                >
                  <HelpCircle size={12} /> {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                {showHint && (
                  <div style={{background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--color-amber)', lineHeight: '1.4'}} data-testid="hint-text">
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
            <ErrorBoundary key={activeChapterNum}>
              {LabComponent ? (
                <LabComponent onComplete={handleChapterComplete} />
              ) : (
                <div className="flex-center" style={{flex: 1, color: 'var(--text-secondary)'}}>
                  Simulator not available for this chapter.
                </div>
              )}
            </ErrorBoundary>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
