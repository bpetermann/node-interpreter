import { TokenType, Lexer } from '../lexer';
import { expect } from '@jest/globals';

it('should create an array of tokens', () => {
  const lexer = Lexer.getInstance();
  const actual = lexer.new('=+(){},;');

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
  const actual = lexer.new('=+(){},;');

  expect(Array.isArray(actual)).toBe(true);

  expect(
    actual.every(
      (token) =>
        token && typeof token === 'object' && validTypes.includes(token['type'])
    )
  ).toBe(true);
});

it('should convert monkey source code', () => {
  const lexer = Lexer.getInstance();
  const actual = lexer.new(
    `
    let five = 5;
    let ten = 10;
    
    let add = fn(x, y) {
      x + y;
  }
  `
  );

  const expected = [
    { type: TokenType.LET, literal: 'let' },
    { type: TokenType.IDENT, literal: 'five' },
    { type: TokenType.ASSIGN, literal: '=' },
    { type: TokenType.INT, literal: '5' },
    { type: TokenType.SEMICOLON, literal: ';' },
    { type: TokenType.LET, literal: 'let' },
    { type: TokenType.IDENT, literal: 'ten' },
    { type: TokenType.ASSIGN, literal: '=' },
    { type: TokenType.INT, literal: '10' },
    { type: TokenType.SEMICOLON, literal: ';' },
    { type: TokenType.LET, literal: 'let' },
    { type: TokenType.IDENT, literal: 'add' },
    { type: TokenType.ASSIGN, literal: '=' },
    { type: TokenType.FUNCTION, literal: 'fn' },
    { type: TokenType.LPAREN, literal: '(' },
    { type: TokenType.IDENT, literal: 'x' },
    { type: TokenType.COMMA, literal: ',' },
    { type: TokenType.IDENT, literal: 'y' },
    { type: TokenType.RPAREN, literal: ')' },
    { type: TokenType.LBRACE, literal: '{ type: ' },
    { type: TokenType.IDENT, literal: 'x' },
    { type: TokenType.PLUS, literal: '+' },
    { type: TokenType.IDENT, literal: 'y' },
    { type: TokenType.SEMICOLON, literal: ';' },
    { type: TokenType.RBRACE, literal: '}' },
    { type: TokenType.SEMICOLON, literal: ';' },
    { type: TokenType.LET, literal: 'let' },
    { type: TokenType.IDENT, literal: 'result' },
    { type: TokenType.ASSIGN, literal: '=' },
    { type: TokenType.IDENT, literal: 'add' },
    { type: TokenType.LPAREN, literal: '(' },
    { type: TokenType.IDENT, literal: 'five' },
    { type: TokenType.COMMA, literal: ',' },
    { type: TokenType.IDENT, literal: 'ten' },
    { type: TokenType.RPAREN, literal: ')' },
    { type: TokenType.SEMICOLON, literal: ';' },
    { type: TokenType.EOF, literal: '' },
  ];

  expect(actual).toEqual(expected);
});
