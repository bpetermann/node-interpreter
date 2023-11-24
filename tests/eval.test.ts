import { expect } from '@jest/globals';
import Parser from '../parser/Parser';
import evaluate from '../evaluator';
import { Program } from '../ast';


it('should parse input to statements', () => {
  const parser = new Parser(`5`);
  const program: Program = parser.parse();

  const expected = 5;

  expect(evaluate(program)).toEqual(expected);
});
