import { expect } from '@jest/globals';
import Parser from '../parser/Parser';

it('should parse input to statements', () => {
  const parser = new Parser(`
    let x = 5;
    let y = 10;
    let foobar = 838383;
    `);
  const actual = parser.parse();

  const stmt = actual.statements.map((stmt) => stmt.name.tokenLiteral());

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
