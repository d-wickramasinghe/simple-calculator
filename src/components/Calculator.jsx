import React, { useState, useEffect, useCallback } from 'react';
import { evaluateExpression, CalcError } from '../utils/calculatorEngine';
import './Calculator.css';

const MAX_EXPR_LENGTH = 60;

const BUTTONS = [
  [{ label: 'C', type: 'clear' }, { label: '(', type: 'op', value: '(' }, { label: ')', type: 'op', value: ')' }, { label: '%', type: 'op', value: '%' }],
  [{ label: '7', type: 'num' }, { label: '8', type: 'num' }, { label: '9', type: 'num' }, { label: '÷', type: 'op', value: '/' }],
  [{ label: '4', type: 'num' }, { label: '5', type: 'num' }, { label: '6', type: 'num' }, { label: '×', type: 'op', value: '*' }],
  [{ label: '1', type: 'num' }, { label: '2', type: 'num' }, { label: '3', type: 'num' }, { label: '−', type: 'op', value: '-' }],
  [{ label: '⌫', type: 'backspace' }, { label: '0', type: 'num' }, { label: '.', type: 'num' }, { label: '+', type: 'op', value: '+' }],
];

export default function Calculator() {
  const [expr, setExpr] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  // Live preview of the result as the user types, without committing it.
  useEffect(() => {
    if (!expr) {
      setPreview('');
      setError('');
      return;
    }
    try {
      const result = evaluateExpression(expr);
      setPreview(formatNumber(result));
      setError('');
    } catch (e) {
      setPreview('');
      // Only show an error once the expression looks "finished enough"
      // to avoid flashing errors on every keystroke (e.g. mid-typing "5/").
      setError('');
    }
  }, [expr]);

  const appendValue = useCallback((val) => {
    setExpr((prev) => {
      if (prev.length >= MAX_EXPR_LENGTH) return prev;
      return prev + val;
    });
    setError('');
  }, []);

  const handleButton = useCallback((btn) => {
    if (btn.type === 'clear') {
      setExpr('');
      setPreview('');
      setError('');
      return;
    }
    if (btn.type === 'backspace') {
      setExpr((prev) => prev.slice(0, -1));
      setError('');
      return;
    }
    if (btn.type === 'num') {
      appendValue(btn.label);
      return;
    }
    if (btn.type === 'op') {
      appendValue(btn.value);
      return;
    }
  }, [appendValue]);

  const handleEquals = useCallback(() => {
    if (!expr.trim()) return;
    try {
      const result = evaluateExpression(expr);
      const formatted = formatNumber(result);
      setHistory((prev) => [{ expr, result: formatted }, ...prev].slice(0, 50));
      setExpr(formatted);
      setPreview('');
      setError('');
    } catch (e) {
      const message = e instanceof CalcError ? e.message : 'Invalid expression';
      setError(message);
      setPreview('');
    }
  }, [expr]);

  const clearHistory = useCallback(() => setHistory([]), []);

  // Keyboard support
  useEffect(() => {
    function onKeyDown(e) {
      const key = e.key;
      if (/[0-9.]/.test(key)) {
        appendValue(key);
      } else if ('+-*/%()'.includes(key)) {
        appendValue(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        setExpr((prev) => prev.slice(0, -1));
      } else if (key === 'Escape') {
        setExpr('');
        setPreview('');
        setError('');
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [appendValue, handleEquals]);

  return (
    <div className="calc-app">
      <div className="calc-card">
        <div className="calc-display">
          <div className="calc-expr" title={expr}>{expr || '0'}</div>
          <div className="calc-result-row">
            {error ? (
              <span className="calc-error">{error}</span>
            ) : (
              <span className="calc-preview">{preview}</span>
            )}
          </div>
        </div>

        <div className="calc-grid">
          {BUTTONS.flat().map((btn, i) => (
            <button
              key={i}
              className={
                'calc-btn ' +
                (btn.type === 'op' ? 'calc-btn--op' : '') +
                (btn.type === 'clear' || btn.type === 'backspace' ? ' calc-btn--fn' : '')
              }
              onClick={() => handleButton(btn)}
            >
              {btn.label}
            </button>
          ))}
          <button className="calc-btn calc-btn--equals" onClick={handleEquals}>=</button>
        </div>
      </div>

      <div className="calc-history">
        <div className="calc-history-head">
          <span>History</span>
          {history.length > 0 && (
            <button className="calc-history-clear" onClick={clearHistory}>Clear</button>
          )}
        </div>
        {history.length === 0 ? (
          <div className="calc-history-empty">Your past calculations will appear here.</div>
        ) : (
          <ul className="calc-history-list">
            {history.map((h, i) => (
              <li key={i} className="calc-history-item" onClick={() => setExpr(h.result)}>
                <div className="calc-history-expr">{h.expr}</div>
                <div className="calc-history-result">= {h.result}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function formatNumber(n) {
  if (!isFinite(n)) return 'Error';
  // Avoid showing unnecessary trailing zeros, but keep reasonable precision.
  const rounded = Math.round((n + Number.EPSILON) * 1e10) / 1e10;
  return rounded.toString();
}
