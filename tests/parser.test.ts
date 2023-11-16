import { expect } from '@jest/globals';
import Parser from '@parser';

it('should parse input to statements', () => {
  const parser = new Parser(`
    let x = 5;
    let y = 10;
    let foobar = 838383;
    `);
  const actual = parser.parse();

  const stmt = actual.statements.map((stmt) => stmt.name?.tokenLiteral());

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

it('should have a length of 3 stmts', () => {
  const parser = new Parser(`
  return 5;
  return 10;
  return 993322;
  `);
  const actual = parser.parse();

  const stmt = actual.statements.length;

  expect(stmt).toEqual(3);
});
