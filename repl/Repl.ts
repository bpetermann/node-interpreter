import { TokenType } from '../token';
import { Parser } from '../parser';
import readline from 'readline';
import { Eval } from '../eval';
export default class Repl {
  private _eval: Eval;

  constructor() {
    this._eval = new Eval();
  }

  private print(line: string) {
    const parser = new Parser(line);
    const program = parser.parse();

    if (parser.errors.length) {
      console.log(parser.errors);
      return;
    }

    const evaluated = this._eval.evaluate(program);
    console.log(evaluated.inspect());
  }

  private processInput(input: string) {
    if (input.trim().toUpperCase() === TokenType.EOF) {
      process.exit(0);
    }

    this.print(input);

    this.start();
  }

  async start() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('>> ', (input) => {
      rl.close();
      this.processInput(input);
    });
  }
}
