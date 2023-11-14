import { Lexer } from '../lexer';
import readline from 'readline';

export default class Repl {
  private _input: string;

  constructor() {
    this._input = '';
  }

  private print() {
    const lexer = new Lexer(this._input);
    console.log('Tokens:', lexer.tokens);
    console.log('Goodbye!');
  }

  private processInput(input: string) {
    if (input.trim().toLowerCase() === 'exit') {
      this.print();
      process.exit(0);
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
