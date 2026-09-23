# Simple Calculator

A responsive calculator built with React + JavaScript. Supports full expression
evaluation with correct operator precedence, brackets, percentages, decimals,
negative numbers, calculation history, and input validation.

**Live demo: https://simple-calculator-six-indol.vercel.app/**  see the link shared alongside this project.

## Features

- **Basic operations** — addition, subtraction, multiplication, division
- **Decimals and negative numbers** — e.g. `-3.5 * 2`
- **Percentage** — `50%` → `0.5`, and calculator-style relative percentage:
  `200 + 10%` → `220`
- **Brackets and precedence** — `(2 + 3) * 4` → `20`, with implicit
  multiplication like `2(3 + 4)` → `14`
- **Clear (`C`) and backspace (`⌫`)**
- **Calculation history** — every evaluated expression and result is listed,
  tap an entry to reuse its result, and history can be cleared
- **Input validation & error handling** — division by zero, unmatched
  brackets, and malformed expressions show a clear inline error instead of
  crashing
- **Keyboard support** — number keys, operators, `Enter`/`=` to evaluate,
  `Backspace`, and `Escape` to clear
- **Responsive UI** — works on mobile and desktop screen sizes

## Project structure

```
calculator/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Calculator.jsx      # UI: keypad, display, history panel
│   │   └── Calculator.css
│   ├── utils/
│   │   └── calculatorEngine.js # tokenizer + recursive-descent parser
│   ├── App.jsx
│   └── index.js
├── package.json
└── README.md
```

## How the engine works

`src/utils/calculatorEngine.js` tokenizes the input string and evaluates it
with a small recursive-descent parser (`expr → term → factor → primary`),
which gives correct `*`/`/` vs `+`/`-` precedence and full bracket support
without relying on `eval()`. Division by zero, unmatched brackets, and
malformed input throw a `CalcError` with a short user-facing message that the
UI displays inline under the display.

## Getting started

```bash
npm install
npm start       # runs the app at http://localhost:3000
npm run build   # production build in /build
```

## Testing

The engine was verified against a set of expression/result pairs covering
precedence, brackets, implicit multiplication, negatives, percentages
(including the relative "200+10%" case), and error conditions (division by
zero, unmatched brackets, incomplete expressions, invalid characters). All UI
interactions (typing, clear, backspace, equals, history, keyboard input) were
tested manually across desktop and mobile viewport widths.

## Screenshots

docs/screenshot-desktop.png
docs/screenshot-calculation.png
docs/screenshot-history.png
docs/screenshot-error.png
docs/screenshot-mobile.png


## Development log

- **Day 01–02:** Project setup, calculator UI, and core operations
  (+ − × ÷), decimals, negatives, clear/backspace.
- **Day 03:** Bracket support, operator precedence, percentage handling,
  calculation history, input validation and error handling, responsive
  polish, and deployment.
