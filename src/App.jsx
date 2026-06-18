import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Zap, CheckCircle2, AlertCircle, HelpCircle,
  BookOpen, Trophy, Compass, Code as CodeIcon,
  Menu, X, Search, ChevronLeft, ChevronRight, ExternalLink
} from 'lucide-react';
import { chaptersData } from './data/chaptersData';
import ErrorBoundary from './components/ErrorBoundary';
import Celebration from './components/Celebration';
import { playSuccess } from './utils/audio';

const MOBILE_BREAKPOINT = 900;

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [celebrate, setCelebrate] = useState(false);
  const isMobileRef = useRef(false);

  // Track viewport size to auto-show sidebar on desktop
  useEffect(() => {
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth <= MOBILE_BREAKPOINT;
      if (!isMobileRef.current) {
        setSidebarOpen(false); // reset — sidebar is always visible via CSS on desktop
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Centralized chapter selection so every entry point behaves the same
  const selectChapter = useCallback((num) => {
    setActiveChapterNum(num);
    setShowHint(false);
    if (isMobileRef.current) setSidebarOpen(false);
  }, []);

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

  // Celebrate whenever the number of completed chapters goes UP (a fresh win).
  // Initialized to the loaded count so restoring progress never triggers it.
  const prevCompletedCount = useRef(completedCount);
  useEffect(() => {
    if (completedCount > prevCompletedCount.current) {
      setCelebrate(true);
      playSuccess();
    }
    prevCompletedCount.current = completedCount;
  }, [completedCount]);

  // Auto-dismiss the confetti so it never lingers.
  useEffect(() => {
    if (!celebrate) return;
    const t = setTimeout(() => setCelebrate(false), 1900);
    return () => clearTimeout(t);
  }, [celebrate]);

  // Prev / Next sequential navigation
  const activeIndex = chaptersData.findIndex(c => c.num === activeChapterNum);
  const prevChapter = activeIndex > 0 ? chaptersData[activeIndex - 1] : null;
  const nextChapter = activeIndex < chaptersData.length - 1 ? chaptersData[activeIndex + 1] : null;

  // Keyboard navigation: ← / → move between chapters, but never while the user
  // is typing in a field or interacting with a simulator.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      const tag = t.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable) return;
      if (t.closest && t.closest('.right-panel')) return; // don't hijack the simulator
      if (e.key === 'ArrowLeft' && prevChapter) {
        selectChapter(prevChapter.num);
      } else if (e.key === 'ArrowRight' && nextChapter) {
        selectChapter(nextChapter.num);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [prevChapter, nextChapter, selectChapter]);

  // Filter the sidebar list by the search query (matches number, title or summary)
  const visibleChapters = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return chaptersData;
    return chaptersData.filter(ch =>
      ch.title.toLowerCase().includes(q) ||
      String(ch.num) === q ||
      `chapter ${ch.num}`.includes(q) ||
      ch.summary.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="app-container">
      {celebrate && <Celebration />}

      {/* Sidebar overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Chapter navigation">
        <header className="sidebar-header">
          <span className="sidebar-logo-mark" aria-hidden="true">
            <Zap size={20} />
          </span>
          <div className="sidebar-brand">
            <h1 className="sidebar-logo">CODE LABS</h1>
            <span className="sidebar-tagline">Interactive Companion</span>
          </div>
          {/* Close button inside sidebar — visible only on mobile via CSS */}
          <button
            className="sidebar-toggle sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </header>

        {/* Progress */}
        <div className="progress-section">
          <div className="progress-labels">
            <span className="progress-label"><Trophy size={13} /> Your progress</span>
            <span className="progress-value" data-testid="progress-text">{completedCount} / {chaptersData.length} ({progressPercent}%)</span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Chapter completion progress"
          >
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Search */}
        <div className="sidebar-search">
          <Search size={16} className="sidebar-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="sidebar-search-input"
            placeholder="Search chapters…"
            aria-label="Search chapters"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="sidebar-search-clear"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <nav className="sidebar-chapters" aria-label="Chapter list">
          {visibleChapters.map((ch) => {
            const isCompleted = !!completedChapters[ch.num];
            const isActive = ch.num === activeChapterNum;
            return (
              <button
                key={ch.num}
                className={`chapter-btn ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                aria-current={isActive ? 'true' : undefined}
                aria-label={`Chapter ${ch.num}: ${ch.title}${isCompleted ? ', completed' : ''}`}
                onClick={() => selectChapter(ch.num)}
              >
                <span className="chapter-index" aria-hidden="true">{ch.num}</span>
                <span className="chapter-text">
                  <span className="chapter-num">Chapter {ch.num}</span>
                  <span className="chapter-title">{ch.title}</span>
                </span>
                {isCompleted && <CheckCircle2 className="chapter-check" size={16} />}
              </button>
            );
          })}
          {visibleChapters.length === 0 && (
            <p className="sidebar-empty">No chapters match “{search}”.</p>
          )}
        </nav>
      </aside>

      {/* Main Workspace */}
      <main className="main-content" aria-label="Chapter workspace">
        <header className="app-header">
          <div className="header-left">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            <div className="header-chapter-info">
              <span className="header-chapter-num">CHAPTER {activeChapter.num}</span>
              <h2 className="header-chapter-title">{activeChapter.title}</h2>
            </div>
          </div>

          <div className="header-right">
            <div className="header-subtitle">
              <BookOpen size={16} />
              <span>Charles Petzold Companion</span>
            </div>
            <div className="chapter-nav" role="group" aria-label="Chapter navigation">
              <button
                className="chapter-nav-btn"
                onClick={() => prevChapter && selectChapter(prevChapter.num)}
                disabled={!prevChapter}
                aria-label={prevChapter ? `Previous chapter: ${prevChapter.title}` : 'No previous chapter'}
                title="Previous chapter (←)"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="chapter-nav-counter">{activeChapter.num} / {chaptersData.length}</span>
              <button
                className="chapter-nav-btn"
                onClick={() => nextChapter && selectChapter(nextChapter.num)}
                disabled={!nextChapter}
                aria-label={nextChapter ? `Next chapter: ${nextChapter.title}` : 'No next chapter'}
                title="Next chapter (→)"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </header>

        <div className="workspace">
          {/* Left Panel: Info, Summary and Challenge */}
          <section className="left-panel glass-panel">
            <div className="panel-title"><Compass size={16} /> Concept Overview</div>
            <div className="summary-text">
              <p>{activeChapter.summary}</p>
            </div>

            {activeChapter.companion && (
              <div className="companion-links">
                <span className="companion-label">
                  <BookOpen size={13} /> Author's interactive version
                </span>
                <div className="companion-link-row">
                  {activeChapter.companion.map((link) => (
                    <a
                      key={link.url}
                      className="companion-link"
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                      <ExternalLink size={13} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            )}

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

              <div className="challenge-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowHint(!showHint)}
                  aria-expanded={showHint}
                  data-testid="hint-toggle-btn"
                >
                  <HelpCircle size={14} /> {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                {showHint && (
                  <div className="hint-text" data-testid="hint-text">
                    {activeChapter.hint}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right Panel: The Interactive Lab */}
          <section className="right-panel glass-panel">
            <div className="panel-title panel-title-flush">
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
