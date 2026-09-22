import { useState } from 'react';

type Operator = '+' | '-' | '×' | '÷';

interface CalculatorState {
  display: string;
  previousValue: number | null;
  operator: Operator | null;
  waitingForOperand: boolean;
  isError: boolean;
}

const initialState: CalculatorState = {
  display: '0',
  previousValue: null,
  operator: null,
  waitingForOperand: false,
  isError: false,
};

function calculate(prev: number, current: number, operator: Operator): number {
  switch (operator) {
    case '+':
      return prev + current;
    case '-':
      return prev - current;
    case '×':
      return prev * current;
    case '÷':
      return current === 0 ? NaN : prev / current; // NaN -> handled as an error below
    default:
      return current;
  }
}

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>(initialState);

  const inputDigit = (digit: string) => {
    setState((s) => {
      if (s.isError) return { ...initialState, display: digit, waitingForOperand: false };
      if (s.waitingForOperand) return { ...s, display: digit, waitingForOperand: false };
      return { ...s, display: s.display === '0' ? digit : s.display + digit };
    });
  };

  const inputDecimal = () => {
    setState((s) => {
      if (s.isError) return { ...initialState, display: '0.', waitingForOperand: false };
      if (s.waitingForOperand) return { ...s, display: '0.', waitingForOperand: false };
      if (s.display.includes('.')) return s;
      return { ...s, display: s.display + '.' };
    });
  };

  const toggleSign = () => {
    setState((s) => {
      if (s.isError || s.display === '0') return s;
      return {
        ...s,
        display: s.display.startsWith('-') ? s.display.slice(1) : '-' + s.display,
      };
    });
  };

  const clear = () => setState(initialState);

  const backspace = () => {
    setState((s) => {
      if (s.isError) return initialState;
      if (s.waitingForOperand) return s;
      const next = s.display.length > 1 ? s.display.slice(0, -1) : '0';
      return { ...s, display: next === '-' ? '0' : next };
    });
  };

  const performOperator = (nextOperator: Operator) => {
    setState((s) => {
      if (s.isError) return s;
      const inputValue = parseFloat(s.display);

      if (s.previousValue === null) {
        return { ...s, previousValue: inputValue, operator: nextOperator, waitingForOperand: true };
      }

      if (s.operator && !s.waitingForOperand) {
        const result = calculate(s.previousValue, inputValue, s.operator);
        if (!isFinite(result)) {
          return { ...initialState, display: 'Error', isError: true };
        }
        return {
          ...s,
          previousValue: result,
          display: String(result),
          operator: nextOperator,
          waitingForOperand: true,
        };
      }

      // Operator pressed again before entering a new operand — just swap it.
      return { ...s, operator: nextOperator };
    });
  };

  const equals = () => {
    setState((s) => {
      if (s.isError || s.operator === null || s.previousValue === null) return s;
      const inputValue = parseFloat(s.display);
      const result = calculate(s.previousValue, inputValue, s.operator);
      if (!isFinite(result)) {
        return { ...initialState, display: 'Error', isError: true };
      }
      return {
        display: String(result),
        previousValue: null,
        operator: null,
        waitingForOperand: true,
        isError: false,
      };
    });
  };

  return {
    display: state.display,
    isError: state.isError,
    inputDigit,
    inputDecimal,
    toggleSign,
    clear,
    backspace,
    performOperator,
    equals,
  };
}
