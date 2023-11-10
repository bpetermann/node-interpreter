import { TokenType, Lexer } from '../lexer';
import { expect } from '@jest/globals';

it('should create an array of tokens', () => {
  const lexer = Lexer.getInstance();

  lexer.input = '=+(){},;';

  lexer.readChar();

  const actual = lexer.tokens;

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

  const lexer = Lexer.getInstance();
  lexer.input = '=+(){},;';
  lexer.readChar();

  const actual = lexer.tokens;

  expect(Array.isArray(actual)).toBe(true);

  expect(
    actual.every(
      (token) =>
        token && typeof token === 'object' && validTypes.includes(token['type'])
    )
  ).toBe(true);
});
