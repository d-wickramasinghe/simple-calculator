import './Calculator.css';

// Day 1: component structure and layout only.
// Button click handling and calculation logic are added on Day 2.
const BUTTON_ROWS: string[][] = [
  ['C', '⌫', '', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '=', ''],
];

export default function Calculator() {
  return (
    <div className="calculator">
      <div className="display">
        <div className="display-value">0</div>
      </div>

      <div className="keys">
        {BUTTON_ROWS.flat().map((label, i) =>
          label ? (
            <button key={i} className="key" type="button">
              {label}
            </button>
          ) : (
            <span key={i} className="key key--spacer" />
          ),
        )}
      </div>
    </div>
  );
}
