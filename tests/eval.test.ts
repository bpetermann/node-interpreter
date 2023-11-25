import { BooleanObject, IntegerObject } from '../object';
import { expect } from '@jest/globals';
import { Parser } from '../parser';
import { Program } from '../ast';
import { Eval } from '../eval';

it('should parse input to statements', () => {
  const parser = new Parser(`5`);
  const program: Program = parser.parse();

  const obj = new Eval().evaluate(program);

  if (!(obj instanceof IntegerObject)) {
    throw new Error('Object is not an integer');
  }

  const expected = 5;

  expect(obj.value).toEqual(expected);
});

it('should parse bang prefix expressions', () => {
  const parser = new Parser(`!true;`);
  const program: Program = parser.parse();

  const obj = new Eval().evaluate(program);

  expect(obj.inspect()).toEqual('false');
});

it('should parse infix expressions', () => {
  const parser = new Parser(`(5 + 10 * 2 + 15 / 3) * 2 + -10;`);
  const expected = 50;

  const program: Program = parser.parse();
  const obj = new Eval().evaluate(program);

  if (!(obj instanceof IntegerObject)) {
    throw new Error('Object is not an integer');
  }

  expect(obj.value).toEqual(expected);
});

it('should parse boolean expressions', () => {
  const parser = new Parser(`(10 + 2) * 30 == 300 + 20 * 3;`);
  const expected = true;

  const program: Program = parser.parse();
  const obj = new Eval().evaluate(program);

  if (!(obj instanceof BooleanObject)) {
    throw new Error('Object is not an boolean');
  }

  expect(obj.value).toEqual(expected);
});
