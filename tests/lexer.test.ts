import { expect } from '@jest/globals';
import { TokenType } from '../token';
import { Lexer } from '../lexer';

it('should create an array of tokens', () => {
  const lexer = new Lexer('=+(){},;');
  const actual = lexer.start();

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

  const lexer = new Lexer('=+(){},;');
  const actual = lexer.start();

  expect(Array.isArray(actual)).toBe(true);

  expect(
    actual.every(
      (token) =>
        token && typeof token === 'object' && validTypes.includes(token['type'])
    )
  ).toBe(true);
});

it('should create only valid tokens', () => {
  const validTypes = Object.values(TokenType);

  const lexer = new Lexer('=+(){},;');
  const actual = lexer.start();

  expect(Array.isArray(actual)).toBe(true);

  const expected = [
    { type: TokenType.ASSIGN, literal: '=' },
    { type: TokenType.PLUS, literal: '+' },
    { type: TokenType.LPAREN, literal: '(' },
    { type: TokenType.RPAREN, literal: ')' },
    { type: TokenType.LBRACE, literal: '{' },
    { type: TokenType.RBRACE, literal: '}' },
    { type: TokenType.COMMA, literal: ',' },
    { type: TokenType.SEMICOLON, literal: ';' },
  ];

  expect(
    actual.every(
      (token) =>
        token && typeof token === 'object' && validTypes.includes(token['type'])
    )
  ).toBe(true);
});

it('should convert source code', () => {
  const lexer = new Lexer(`
  let five = 5;
  let ten = 10;
  
  let add = fn(x, y) {
    x + y;
  };

  let result = add(five, ten);
  !-/*5;
  5 < 10 > 5;
  
  if (5 < 10) {
    return true;
  } else {
    return false;
  }

  10 == 10;
  10 != 9;
  `);

  const actual = lexer.start();

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
    { type: TokenType.LBRACE, literal: '{' },
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
    { type: TokenType.BANG, literal: '!' },
    { type: TokenType.MINUS, literal: '-' },
    { type: TokenType.SLASH, literal: '/' },
    { type: TokenType.ASTERISK, literal: '*' },
    { type: TokenType.INT, literal: '5' },
    { type: TokenType.SEMICOLON, literal: ';' },
    { type: TokenType.INT, literal: '5' },
    { type: TokenType.LT, literal: '<' },
    { type: TokenType.INT, literal: '10' },
    { type: TokenType.GT, literal: '>' },
    { type: TokenType.INT, literal: '5' },
    { type: TokenType.SEMICOLON, literal: ';' },
    { type: TokenType.IF, literal: 'if' },
    { type: TokenType.LPAREN, literal: '(' },
    { type: TokenType.INT, literal: '5' },
    { type: TokenType.LT, literal: '<' },
    { type: TokenType.INT, literal: '10' },
    { type: TokenType.RPAREN, literal: ')' },
    { type: TokenType.LBRACE, literal: '{' },
    { type: TokenType.RETURN, literal: 'return' },
    { type: TokenType.TRUE, literal: 'true' },
    { type: TokenType.SEMICOLON, literal: ';' },
    { type: TokenType.RBRACE, literal: '}' },
    { type: TokenType.ELSE, literal: 'else' },
    { type: TokenType.LBRACE, literal: '{' },
    { type: TokenType.RETURN, literal: 'return' },
    { type: TokenType.FALSE, literal: 'false' },
    { type: TokenType.SEMICOLON, literal: ';' },
    { type: TokenType.RBRACE, literal: '}' },
    { type: TokenType.INT, literal: '10' },
    { type: TokenType.EQ, literal: '==' },
    { type: TokenType.INT, literal: '10' },
    { type: TokenType.SEMICOLON, literal: ';' },
    { type: TokenType.INT, literal: '10' },
    { type: TokenType.NOT_EQ, literal: '!=' },
    { type: TokenType.INT, literal: '9' },
    { type: TokenType.SEMICOLON, literal: ';' },
    { type: TokenType.EOF, literal: '' },
  ];

  expect(actual).toEqual(expected);
});
