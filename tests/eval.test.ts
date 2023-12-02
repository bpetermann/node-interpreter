import { parseAndEval, cleanInspect } from './helper';
import { expect } from '@jest/globals';
import * as obj from '../object';

it('should evaluate integer literal', () => {
  const actual = parseAndEval(`5`);
  const expected = 5;

  expect(actual).toBeInstanceOf(obj.Integer);
  expect((actual as obj.Integer).value).toEqual(expected);
});

it('should evaluate prefix expressions', () => {
  const actual = parseAndEval(`!true;`);
  const expected = false;

  expect(actual).toBeInstanceOf(obj.Boolean);
  expect((actual as obj.Boolean).value).toEqual(expected);
});

it('should evaluate boolean literals', () => {
  const actual = parseAndEval(`(10 + 2) * 30 == 300 + 20 * 3;`);
  const expected = true;

  expect(actual).toBeInstanceOf(obj.Boolean);
  expect((actual as obj.Boolean).value).toEqual(expected);
});

it('should evaluate infix expressions', () => {
  const actual = parseAndEval(`(5 + 10 * 2 + 15 / 3) * 2 + -10;`);
  const expected = 50;

  expect(actual).toBeInstanceOf(obj.Integer);
  expect((actual as obj.Integer).value).toEqual(expected);
});

it('should evaluate conditionals', () => {
  const actual = parseAndEval(`if (1 < 2) { 10 } else { 20 };`);
  const expected = 10;

  expect(actual).toBeInstanceOf(obj.Integer);
  expect((actual as obj.Integer).value).toEqual(expected);
});

it('should evaluate errors', () => {
  const actual = parseAndEval(`if (10 > 1) { true + false; };`);
  const expected = 'unknown operator: BOOLEAN + BOOLEAN';

  expect(actual).toBeInstanceOf(obj.Error);
  expect(cleanInspect(actual)).toEqual(expected);
});

it('should evaluate return statements', () => {
  const actual = parseAndEval(`
  if (10 > 1) {
    if (10 > 1) {
      return 10;
    }
    return 1;
  }
  `);
  const expected = '10';

  expect(actual).toBeInstanceOf(obj.ReturnValue);
  expect(cleanInspect(actual)).toEqual(expected);
});

it('should evaluate functions', () => {
  const actual = parseAndEval(
    `let add = fn(x, y) { x + y; }; add(5 + 5, add(5, 5));`,
    1
  );
  const expected = 20;

  expect(actual).toBeInstanceOf(obj.Integer);
  expect((actual as obj.Integer).value).toEqual(expected);
});

it('should evaluate recursive functions', () => {
  const actual = parseAndEval(
    `let factorial = fn(n) { if (n == 0) { 1 } else { n * factorial(n - 1) } }; factorial(10);`,
    1
  );
  const expected = 3628800;

  expect(actual).toBeInstanceOf(obj.Integer);
  expect((actual as obj.Integer).value).toEqual(expected);
});

it('should evaluate strings', () => {
  const actual = parseAndEval(`"Hello" + " " + "World!";`);
  const expected = 'Hello World!';

  expect(actual).toBeInstanceOf(obj.String);
  expect((actual as obj.String).value).toEqual(expected);
});

it('should evaluate strings', () => {
  const actual = parseAndEval(`len("hello world")`);
  const expected = 11;

  expect((actual as obj.Integer).value).toEqual(expected);
});

it('should evaluate strings', () => {
  const actual = parseAndEval(`[1, 2 * 2, 3 + 3];`);

  expect(cleanInspect(actual)).toEqual('[1,4,6]');
});
