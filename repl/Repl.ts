import { TokenType } from '@token';
import readline from 'readline';
import Parser from '@parser';

export default class Repl {
  private _input: string;

  constructor() {
    this._input = '';
  }

  private print() {
    const parser = new Parser(this._input);
    parser.parse();
    process.exit(0);
  }

  private processInput(input: string) {
    if (input.trim().toUpperCase() === TokenType.EOF) {
      this.print();
    }

    this._input += input;

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
