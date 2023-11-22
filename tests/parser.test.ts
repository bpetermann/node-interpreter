import {
  LetStatement,
  ExpressionStatement,
  InfixExpression,
  BooleanLiteral,
} from '../ast';
import { expect } from '@jest/globals';
import Parser from '../parser/Parser';

it('should parse input to statements', () => {
  const parser = new Parser(`
    let x = 5;
    let y = 10;
    let foobar = 838383;
    `);
  const actual = parser.parse();

  const stmt = actual.statements.map((stmt) => {
    if (stmt instanceof LetStatement) {
      return stmt.name.tokenLiteral();
    }
  });

  const expected = ['x', 'y', 'foobar'];

  expect(stmt).toEqual(expected);
});

it('should add an error message', () => {
  const parser = new Parser(`let x x 5;`);
  parser.parse();

  const errors = parser.errors;

  const expected = [`expected next token to be "=" got "x" instead`];

  expect(errors).toEqual(expected);
});

it('should have a length of 3', () => {
  const parser = new Parser(`
  return 5;
  return 10;
  return 993322;
  `);
  const actual = parser.parse();

  const stmt = actual.statements.length;

  expect(stmt).toEqual(3);
});

it('should parse string expressions', () => {
  const parser = new Parser(`
  foo;
  `);
  const actual = parser.parse();

  const stmt = actual.statements[0].tokenLiteral();

  expect(stmt).toEqual('foo');
});

it('should parse number expressions', () => {
  const parser = new Parser(`
  5;
  `);
  const actual = parser.parse();

  const stmt = actual.statements[0].tokenLiteral();

  expect(stmt).toEqual('5');
});

it('should parse prefix expressions', () => {
  const parser = new Parser(`
  !5;
  `);
  const actual = parser.parse();

  const stmt = actual.statements[0].tokenLiteral();

  expect(stmt).toEqual('!');
});

it('should parse infix expressions', () => {
  const parser = new Parser(`
  5 + 3;
  `);
  const actual = parser.parse();

  const stmt = actual.statements[0];

  expect(stmt).toBeInstanceOf(ExpressionStatement);
  if (
    stmt instanceof ExpressionStatement &&
    stmt.expression instanceof InfixExpression
  ) {
    expect(stmt.expression.left.tokenLiteral()).toEqual('5');
    expect(stmt.expression.operator).toEqual('+');
    expect(stmt.expression.right.tokenLiteral()).toEqual('3');
  }
});

it('should parse boolean expressions', () => {
  const parser = new Parser(`
  true;
  `);
  const actual = parser.parse();

  const stmt = actual.statements[0] as ExpressionStatement;

  expect(stmt).toBeInstanceOf(ExpressionStatement);
  expect((stmt.expression as BooleanLiteral).value).toEqual(true);
});
