# Simple Calculator

A responsive calculator built with React + TypeScript, developed as part of a
5-day internship task.

## Progress

- [x] Day 1 — Project setup & basic calculator UI
- [x] Day 2 — Core calculation functionality
- [ ] Day 3
- [ ] Day 4
- [ ] Day 5

## Day 1 — Project Setup & Basic Calculator UI

- React + TypeScript project scaffolded with Vite.
- `Calculator` component created with display and button-grid structure.
- Number, operator, clear, backspace, decimal and equals buttons laid out.
- Responsive layout (works down to small phone widths).

## Day 2 — Core Calculation Functionality

- Added `useCalculator` hook (`src/hooks/useCalculator.ts`) holding all
  calculator state and logic.
- Implemented addition, subtraction, multiplication and division.
- Wired every button to real input handling (numbers, operators, `=`).
- Decimal input (one `.` per number) and negative numbers (`±` toggles sign).
- `C` clears the calculator; `⌫` deletes the last digit.
- Basic safety net: dividing by zero (or any non-finite result) shows
  `Error` on the display instead of crashing or showing `Infinity`.

Note: this is a simple sequential calculator (operand → operator → operand →
`=`), not a full expression parser — operator precedence and bracket support
are scoped for a later day.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Screenshots

_Add screenshots here after running `npm run dev` locally, e.g.:_

```
screenshots/day1-ui.png
```
