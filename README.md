# Code Labs: Interactive Companion to Charles Petzold's "Code"

An interactive, educational web application designed to accompany **"Code: The Hidden Language of Computer Hardware and Software"** by Charles Petzold. It provides hands-on simulators for all 28 chapters, helping users visually understand how computer hardware and software are built from the ground up.

---

## ⚡ Key Features

- **28 Interactive Simulators** — one per chapter, covering:
  - Morse Code & Flashlight Circuits (Chapters 1, 4, 5, 7)
  - Logic Gate Simulations (Chapters 6, 8, 14)
  - Binary, Octal, Hex & ASCII/Unicode Builders (Chapters 2, 3, 9, 10, 12, 13)
  - Flip-Flops, Clocks & Memory (Chapters 17, 18, 19)
  - ALU, CPU, Registers & Assembly (Chapters 15–16, 20–24)
  - Peripherals, OS, Compilers & Networking (Chapters 25–28)
- **Progress Tracking** — completion state persisted to `localStorage` across sessions
- **Challenge System** — each chapter has a hands-on challenge with built-in hints
- **Accessible UI** — ARIA attributes, keyboard navigation, focus indicators, screen-reader support
- **Error Resilient** — error boundary prevents one broken chapter from crashing the app

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 8 |
| Styling | Vanilla CSS with glassmorphism design system, dark theme, micro-animations |
| Icons | Lucide React |
| Unit Tests | Vitest + React Testing Library |
| E2E Tests | Playwright |

---

## 📁 Project Structure

```
src/
├── App.jsx                        # Main shell, routing, state management
├── main.jsx                       # Entry point
├── index.css                      # Global styles & design system
├── components/
│   ├── chapters/                  # 28 individual chapter simulators
│   │   ├── Chapter1.jsx           #   Morse code flashlight
│   │   ├── Chapter2.jsx           #   Codes & Combinations
│   │   ├── ...
│   │   └── Chapter28.jsx          #   The World Brain (networking)
│   ├── shared/
│   │   ├── ToggleSwitch.jsx       # Accessible toggle switch component
│   │   └── DisplayCard.jsx        # Reusable value display card
│   └── ErrorBoundary.jsx          # Catches render errors per-chapter
├── data/
│   └── chaptersData.js            # Chapter metadata (titles, summaries, challenges, hints)
├── utils/
│   ├── binaryUtils.js             # Shared binary/hex/octal conversion functions
│   └── audio.js                   # Web Audio API helpers for tone generation
└── test/
    ├── setup.js                   # Vitest setup (React Testing Library)
    ├── binaryUtils.test.js        # 29 tests
    ├── chaptersData.test.js       # 8 tests
    ├── ToggleSwitch.test.jsx      # 12 tests
    ├── DisplayCard.test.jsx       # 8 tests
    └── ErrorBoundary.test.jsx     # 5 tests
tests/
├── navigation.spec.js             # E2E: navigation, sidebar, ARIA
├── persistence.spec.js            # E2E: localStorage, reload persistence
└── simulators.spec.js             # E2E: chapter challenge interactions
```

---

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+

### Installation

```bash
npm install
```

### Running the App

```bash
npm run dev
```

Open `http://localhost:5173/` in your browser to start exploring the labs.

### Building for Production

```bash
npm run build
npm run preview
```

---

## 🧪 Testing

### Unit Tests (Vitest)

62 unit tests covering utilities, shared components, data integrity, and error handling.

```bash
# Run once
npm run test:unit

# Watch mode (re-runs on file changes)
npm run test:unit:watch
```

### E2E Tests (Playwright)

18 end-to-end tests covering navigation, state persistence, challenge interactions, and accessibility.

```bash
# Install Playwright browsers (first time only)
npx playwright install chromium

# Run tests
npm run test:e2e

# Interactive UI mode (for debugging)
npm run test:e2e:ui
```

### All Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test:unit` | Run unit tests |
| `npm run test:unit:watch` | Unit tests in watch mode |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:e2e:ui` | E2E tests with UI |

---

## ♿ Accessibility

- `role="switch"` and `aria-checked` on all toggle switches
- `role="progressbar"` with `aria-valuenow` on progress indicator
- `aria-current="true"` on active chapter in sidebar
- `aria-expanded` on hint toggle buttons
- `focus-visible` outlines on all interactive elements
- `<noscript>` fallback for JavaScript-disabled browsers
- Screen-reader-only utility class (`.sr-only`)
