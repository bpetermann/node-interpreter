import { IntegerObject } from '../object';
import { expect } from '@jest/globals';
import {Eval} from '../evaluator';
import { Program } from '../ast';
import {Parser} from '../parser';


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
