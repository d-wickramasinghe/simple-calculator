import { useCalculator } from '../hooks/useCalculator';
import './Calculator.css';

// Day 2: buttons are now wired to real calculator state and logic
// (see src/hooks/useCalculator.ts).
export default function Calculator() {
  const calc = useCalculator();

  return (
    <div className="calculator">
      <div className={`display${calc.isError ? ' display--error' : ''}`}>
        <div className="display-value">{calc.display}</div>
      </div>

      <div className="keys">
        <button className="key key--fn" type="button" onClick={calc.clear}>
          C
        </button>
        <button className="key key--fn" type="button" onClick={calc.toggleSign} aria-label="Toggle sign">
          ±
        </button>
        <button className="key key--fn" type="button" onClick={calc.backspace} aria-label="Backspace">
          ⌫
        </button>
        <button className="key key--op" type="button" onClick={() => calc.performOperator('÷')}>
          ÷
        </button>

        <button className="key" type="button" onClick={() => calc.inputDigit('7')}>
          7
        </button>
        <button className="key" type="button" onClick={() => calc.inputDigit('8')}>
          8
        </button>
        <button className="key" type="button" onClick={() => calc.inputDigit('9')}>
          9
        </button>
        <button className="key key--op" type="button" onClick={() => calc.performOperator('×')}>
          ×
        </button>

        <button className="key" type="button" onClick={() => calc.inputDigit('4')}>
          4
        </button>
        <button className="key" type="button" onClick={() => calc.inputDigit('5')}>
          5
        </button>
        <button className="key" type="button" onClick={() => calc.inputDigit('6')}>
          6
        </button>
        <button className="key key--op" type="button" onClick={() => calc.performOperator('-')}>
          -
        </button>

        <button className="key" type="button" onClick={() => calc.inputDigit('1')}>
          1
        </button>
        <button className="key" type="button" onClick={() => calc.inputDigit('2')}>
          2
        </button>
        <button className="key" type="button" onClick={() => calc.inputDigit('3')}>
          3
        </button>
        <button className="key key--op" type="button" onClick={() => calc.performOperator('+')}>
          +
        </button>

        <button className="key key--zero" type="button" onClick={() => calc.inputDigit('0')}>
          0
        </button>
        <button className="key" type="button" onClick={calc.inputDecimal}>
          .
        </button>
        <button className="key key--eq" type="button" onClick={calc.equals}>
          =
        </button>
      </div>
    </div>
  );
}
