import { BooleanObject, ErrorObject, IntegerObject } from '../object';
import { Environment } from '../object';
import { expect } from '@jest/globals';
import { Parser } from '../parser';
import { Program } from '../ast';
import { Eval } from '../eval';

it('should parse input to statements', () => {
  const parser = new Parser(`5`);
  const program: Program = parser.parse();

  const obj = new Eval(new Environment({})).evaluate(program)[0];

  if (!(obj instanceof IntegerObject)) {
    throw new Error('Object is not an integer');
  }

  const expected = 5;

  expect(obj.value).toEqual(expected);
});

it('should parse bang prefix expressions', () => {
  const parser = new Parser(`!true;`);
  const program: Program = parser.parse();

  const obj = new Eval(new Environment({})).evaluate(program)[0];

  expect(obj.inspect()).toEqual('false');
});

it('should parse infix expressions', () => {
  const parser = new Parser(`(5 + 10 * 2 + 15 / 3) * 2 + -10;`);
  const expected = 50;

  const program: Program = parser.parse();
  const obj = new Eval(new Environment({})).evaluate(program)[0];

  if (!(obj instanceof IntegerObject)) {
    throw new Error('Object is not an integer');
  }

  expect(obj.value).toEqual(expected);
});

it('should parse boolean expressions', () => {
  const parser = new Parser(`(10 + 2) * 30 == 300 + 20 * 3;`);
  const expected = true;

  const program: Program = parser.parse();
  const obj = new Eval(new Environment({})).evaluate(program)[0];

  if (!(obj instanceof BooleanObject)) {
    throw new Error('Object is not an boolean');
  }

  expect(obj.value).toEqual(expected);
});

it('should return error objects', () => {
  const parser = new Parser(`if (10 > 1) { true + false; };`);
  const expected = true;

  const program: Program = parser.parse();
  const obj = new Eval(new Environment({})).evaluate(program)[0];

  if (!(obj instanceof ErrorObject)) {
    throw new Error('Object is not an error');
  }
  const cleanInspect = obj.inspect().replace(/\x1B\[[0-9;]*m/g, '');
  expect(cleanInspect).toEqual('unknown operator: BOOLEAN + BOOLEAN');
});
