import { Object, Environment } from '../object';
import { Parser } from '../parser';
import { Program } from '../ast';
import { Eval } from '../eval';

const cleanInspect = (obj: Object) => {
  return obj.inspect().replace(/\x1B\[[0-9;]*m/g, '');
};

const cleanStmt = (input: string) => {
  return input.replace(/\x1B\[[0-9;]*m/g, '').trim();
};

const parse = (input: string) => {
  const parser = new Parser(input);
  return parser.parse();
};

const parseAndEval = (input: string, pos?: number) => {
  const parser = new Parser(input);
  const program: Program = parser.parse();
  return new Eval().evaluate(program, new Environment({}))[pos ?? 0];
};

export { cleanInspect, cleanStmt, parse, parseAndEval };
