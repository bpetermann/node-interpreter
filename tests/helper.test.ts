import { precedences } from '../lib/parser/helper';
import { expect } from '@jest/globals';
import { TokenType } from '../types';

it('should map token types to numbers', () => {
  const eq = precedences(TokenType.EQ);
  const lg = precedences(TokenType.LT);
  const sum = precedences(TokenType.PLUS);

  const expected = [1, 2, 4];

  expect([eq, lg, sum]).toEqual(expected);
});
