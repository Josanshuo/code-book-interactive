# Code Labs: Interactive Companion to Charles Petzold's "Code"

This project is a highly interactive, educational web application designed to accompany the book **"Code: The Hidden Language of Computer Hardware and Software"** by Charles Petzold. It provides hands-on simulators for concepts across all 28 chapters, helping users visually and practically understand how computer hardware and software are built from the ground up.

---

## 🚀 Key Features

- **Interactive Simulators**: Interactive labs for each chapter (Chapters 1 to 28), including:
  - **Morse Code & Flashlight Circuits** (Chapters 1, 4, 5, 7)
  - **Logic Gate Simulations** (Chapters 6, 8, 14)
  - **Binary, Octal, Hexadecimal, and ASCII/Unicode Builders** (Chapters 2, 3, 9, 10, 12, 13)
  - **Registers, CPUs, and Loop Simulators** (Chapters 15 through 28)
- **Progress Tracking & Persistence**: Real-time progress updates and Trophy count synced to `localStorage`, so your challenge completion states persist across sessions.
- **Embedded Hints**: Visual guides and hints to help solve complex challenges.

---

## 🛠️ Technology Stack

- **Frontend**: React (v19) + Vite (v8)
- **Icons**: Lucide React
- **Styling**: Modern, premium CSS (Glassmorphism design system, smooth transition micro-animations, glowing dark theme)
- **Testing**: Playwright End-to-End (E2E) testing framework

---

## 💻 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation
1. Clone the repository and navigate to the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
Start the local development server:
```bash
npm run dev
```
The server will run on `http://localhost:5173/`. Open it in your browser to interact with the labs.

---

## 🧪 Running E2E Tests

The project includes a comprehensive end-to-end test suite powered by **Playwright**. The tests verify navigation, state persistence, and interactive behaviors of several key simulators.

To run the tests:

1. Install Playwright browser dependencies (if not already installed):
   ```bash
   npx playwright install chromium
   ```

2. Run tests in headless mode:
   ```bash
   npm run test:e2e
   ```

3. Run tests in interactive UI mode (useful for debugging):
   ```bash
   npm run test:e2e:ui
   ```
