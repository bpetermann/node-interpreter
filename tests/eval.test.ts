import { expect } from '@jest/globals';
import Parser from '../parser/Parser';
import evaluate from '../evaluator';
import { Program } from '../ast';
import { IntegerObject } from '../object';

it('should parse input to statements', () => {
  const parser = new Parser(`5`);
  const program: Program = parser.parse();

  const obj = evaluate(program);

  if (!(obj instanceof IntegerObject)) {
    throw new Error('Object is not an integer');
  }

  const expected = 5;

  expect(obj.value).toEqual(expected);
});
