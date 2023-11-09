import { Lexer, TokenType } from '../lexer/Lexer';
import { expect } from '@jest/globals';

it('should create an array of tokens', () => {
  const lexer = Lexer.getInstance('=+(){},;');

  const actual = lexer.getTokens();

  expect(Array.isArray(actual)).toBe(true);

  expect(
    actual.every(
      (token) =>
        token &&
        typeof token === 'object' &&
        token.hasOwnProperty('type') &&
        token.hasOwnProperty('literal')
    )
  ).toBe(true);
});

it('should create only valid tokens', () => {
  const validTypes = Object.values(TokenType);

  const lexer = Lexer.getInstance('=+(){},;');

  const actual = lexer.getTokens();

  expect(Array.isArray(actual)).toBe(true);

  expect(
    actual.every(
      (token) =>
        token && typeof token === 'object' && validTypes.includes(token['type'])
    )
  ).toBe(true);
});
