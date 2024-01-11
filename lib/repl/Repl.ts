import { Environment } from '../object';
import { TokenType } from '../../types';
import { Parser } from '../parser';
import readline from 'readline';
import { Eval } from '../eval';
import colors from 'colors';

export default class Repl {
  rl: readline.Interface;
  private eval: Eval;
  env: Environment;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.env = new Environment({});
    this.eval = new Eval();
  }

  private print(line: string) {
    const parser = new Parser(line);
    const program = parser.parse();

    if (parser.errors.length) {
      parser.errors.forEach((err) => {
        console.log(colors.red(err));
      });
      return;
    }

    const evaluated = this.eval.evaluate(program, this.env);
    evaluated.forEach((obj) => {
      console.log(obj ? obj.inspect() : colors.gray('undefined'));
    });
  }

  private processInput(input: string) {
    if (input.trim().toUpperCase() === TokenType.EOF) {
      this.rl.close();
      process.exit(0);
    }

    this.print(input);

    this.start();
  }

  start() {
    this.rl.question('>> ', (input) => {
      this.processInput(input);
    });
  }
}
