// calculatorEngine.js
// Tokenizes and evaluates a calculator expression string with:
// - + - * / operators, correct precedence
// - ( ) brackets, including implicit multiplication like 2(3+4)
// - decimals and negative numbers (unary minus)
// - % (percentage) as a postfix operator: "50%" -> 0.5, "200+10%" -> 220
// Throws { message } style Errors with short user-facing text on invalid input.

export class CalcError extends Error {}

function tokenize(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (ch === ' ') {
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let num = ch;
      i++;
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        num += expr[i];
        i++;
      }
      if ((num.match(/\./g) || []).length > 1) {
        throw new CalcError('Invalid number');
      }
      tokens.push({ type: 'num', value: parseFloat(num) });
      continue;
    }
    if ('+-*/%()'.includes(ch)) {
      tokens.push({ type: ch });
      i++;
      continue;
    }
    throw new CalcError('Invalid character');
  }
  return tokens;
}

// Recursive-descent parser
// expr    := term (('+' | '-') term)*
// term    := factor (('*' | '/') factor)*
// factor  := ('-' | '+')? primary ('%')?
// primary := number | '(' expr ')'
function parse(tokens) {
  let pos = 0;

  function peek() {
    return tokens[pos];
  }

  function consume(type) {
    const t = tokens[pos];
    if (!t || t.type !== type) {
      throw new CalcError('Unexpected token');
    }
    pos++;
    return t;
  }

  function parsePrimary() {
    const t = peek();
    if (!t) throw new CalcError('Unexpected end of expression');
    if (t.type === 'num') {
      pos++;
      return t.value;
    }
    if (t.type === '(') {
      pos++;
      const val = parseExpr();
      consume(')');
      return val;
    }
    throw new CalcError('Unexpected token');
  }

  function parseFactor() {
    const t = peek();
    let sign = 1;
    if (t && (t.type === '-' || t.type === '+')) {
      pos++;
      if (t.type === '-') sign = -1;
      return sign * parseFactor();
    }
    let val = parsePrimary();
    // postfix percentage, possibly chained e.g. 50%%
    while (peek() && peek().type === '%') {
      pos++;
      val = val / 100;
    }
    // implicit multiplication: "2(3+4)" or "(2)(3)"
    if (peek() && peek().type === '(') {
      val = val * parseFactor();
    }
    return val;
  }

  function parseTerm() {
    let val = parseFactor();
    while (peek() && (peek().type === '*' || peek().type === '/')) {
      const op = consume(peek().type).type;
      const rhs = parseFactor();
      if (op === '*') {
        val = val * rhs;
      } else {
        if (rhs === 0) throw new CalcError('Cannot divide by zero');
        val = val / rhs;
      }
    }
    return val;
  }

  function parseExpr() {
    let val = parseTerm();
    while (peek() && (peek().type === '+' || peek().type === '-')) {
      const op = consume(peek().type).type;
      // Calculator-style relative percentage: "200+10%" means
      // 200 + (10% of 200), not 200 + 0.1. Only applies when the
      // term is a bare "<number>%" with nothing else attached.
      const isBarePercent =
        peek() && peek().type === 'num' &&
        tokens[pos + 1] && tokens[pos + 1].type === '%' &&
        (!tokens[pos + 2] || !'*/('.includes(tokens[pos + 2].type));
      let rhs;
      if (isBarePercent) {
        const pct = consume('num').value;
        consume('%');
        rhs = val * (pct / 100);
      } else {
        rhs = parseTerm();
      }
      val = op === '+' ? val + rhs : val - rhs;
    }
    return val;
  }

  if (tokens.length === 0) throw new CalcError('Empty expression');
  const result = parseExpr();
  if (pos !== tokens.length) throw new CalcError('Unexpected token');
  return result;
}

// Basic bracket balance pre-check for friendlier errors
function checkBrackets(expr) {
  let depth = 0;
  for (const ch of expr) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (depth < 0) throw new CalcError('Unmatched )');
  }
  if (depth !== 0) throw new CalcError('Unmatched (');
}

export function evaluateExpression(expr) {
  const trimmed = expr.trim();
  if (!trimmed) throw new CalcError('Empty expression');
  checkBrackets(trimmed);
  const tokens = tokenize(trimmed);
  const result = parse(tokens);
  if (!isFinite(result)) throw new CalcError('Result is not a finite number');
  // Round to avoid floating point noise, keep up to 10 significant decimals
  const rounded = Math.round((result + Number.EPSILON) * 1e10) / 1e10;
  return rounded;
}
