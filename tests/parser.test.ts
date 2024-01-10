import { parse, cleanStmt } from './helper';
import { expect } from '@jest/globals';
import { Parser } from '../lib/parser';
import * as ast from '../lib/ast';

it('should parse input to statements', () => {
  const actual = parse(`
  let x = 5;
  let y = 10;
  let foobar = 838383;
  `);
  const expected = ['x', 'y', 'foobar'];

  const stmt = actual.statements.map((stmt) => {
    if (stmt instanceof ast.LetStatement) {
      return stmt.name.tokenLiteral();
    }
  });

  expect(stmt).toEqual(expected);
});

it('should add an error message', () => {
  const parser = new Parser(`let x x 5;`);
  parser.parse();

  const errors = parser.errors;

  const expected = [`expected next token to be "=" got "x" instead`];

  expect(errors).toEqual(expected);
});

it('should parse all statements', () => {
  const actual = parse(`
  return 5;
  return 10;
  return 993322;
  `);

  const expected = 3;

  expect(actual.statements.length).toEqual(expected);
});

it('should parse string expressions', () => {
  const actual = parse(`
  foo;
  `);
  const expected = 'foo';

  expect(actual.statements[0].tokenLiteral()).toEqual(expected);
});

it('should parse number expressions', () => {
  const actual = parse(`
  5;
  `);
  const expected = '5';

  expect(actual.statements[0].tokenLiteral()).toEqual(expected);
});

it('should parse prefix expressions', () => {
  const actual = parse(`
  !5;
  `);
  const expected = '!';

  expect(actual.statements[0].tokenLiteral()).toEqual(expected);
});

it('should parse infix expressions', () => {
  const actual = parse(`
  5 + 3;
  `);

  const stmt = actual.statements[0];

  expect(actual.statements[0]).toBeInstanceOf(ast.ExpressionStatement);
  expect(
    (actual.statements[0] as ast.ExpressionStatement).expression
  ).toBeInstanceOf(ast.InfixExpression);

  const { left, operator, right } = (
    actual.statements[0] as ast.ExpressionStatement
  ).expression as ast.InfixExpression;
  expect(left.tokenLiteral()).toEqual('5');
  expect(operator).toEqual('+');
  expect(right.tokenLiteral()).toEqual('3');
});

it('should parse boolean literals', () => {
  const actual = parse(`
  true;
  `);
  const expected = true;
  const stmt = actual.statements[0] as ast.ExpressionStatement;

  expect(actual.statements[0]).toBeInstanceOf(ast.ExpressionStatement);
  expect((stmt.expression as ast.BooleanLiteral).value).toEqual(expected);
});

it('should parse grouped expressions', () => {
  const actual = parse(`a * [1, 2, 3, 4][b * c] * d;`);

  const expected = '((a * ([1,2,3,4][(b * c)])) * d)';

  expect(cleanStmt(actual.getString())).toBe(expected);
});

it('should parse if expressions', () => {
  const actual = parse(`
  if (x > y) { x } else { y };
  `);
  const expected = 'if (x > y) x else y';

  expect(cleanStmt(actual.getString())).toBe(expected);
});

it('should parse if expressions', () => {
  const actual = parse(`
  fn(x, y) { x + y; }
  `);
  const expected = 'fn(x, y) {(x + y)}';

  expect(cleanStmt(actual.getString())).toBe(expected);
});

it('should parse strings', () => {
  const actual = parse(`"hello, world";`);
  const expected = 'hello, world';
  const stmt = actual.statements[0] as ast.ExpressionStatement;

  expect(stmt).toBeInstanceOf(ast.ExpressionStatement);
  expect(stmt.expression).toBeInstanceOf(ast.StringLiteral);
  expect((stmt.expression as ast.StringLiteral).value).toEqual(expected);
});

it('should parse arrays', () => {
  const actual = parse(`[1,2,3,4];`);

  expect(cleanStmt(actual.getString())).toBe('[1,2,3,4]');
});

it('should parse index expressions', () => {
  const actual = parse('myArray[1 + 1];');
  const stmt = actual.statements[0] as ast.ExpressionStatement;

  expect(stmt.expression).toBeInstanceOf(ast.IndexExpression);
  const { left, index } = stmt.expression as ast.IndexExpression;

  expect(left.tokenLiteral()).toBe('myArray');
  expect(cleanStmt(index.getString())).toBe('(1 + 1)');
});

it('should parse hash literals', () => {
  const actual = parse('{"one": 1, "two": 2, "three": 3}');
  const stmt = actual.statements[0] as ast.ExpressionStatement;

  expect(stmt.expression).toBeInstanceOf(ast.HashLiteral);

  const hash = stmt.expression as ast.HashLiteral;
  expect(cleanStmt(hash.getString())).toBe('{one: 1, two: 2, three: 3}');
});

it('should parse hash literals with expressions', () => {
  const actual = parse('{"one": 0 + 1, "two": 10 - 8, "three": 15 / 5}');
  const stmt = actual.statements[0] as ast.ExpressionStatement;

  expect(stmt.expression).toBeInstanceOf(ast.HashLiteral);

  const hash = stmt.expression as ast.HashLiteral;
  expect(cleanStmt(hash.getString())).toBe(
    '{one: (0 + 1), two: (10 - 8), three: (15 / 5)}'
  );
});
