import { Lexer } from '../lexer';
import { Token } from '../token';
import readline from 'readline';

export default class Repl {
  private _lexer: Lexer;
  private _tokens: Token[];
  private _input: string;

  constructor() {
    this._input = '';
    this._lexer = new Lexer();
    this._tokens = [];
  }

  private print() {
    this._tokens = this._lexer.start(this._input);
    console.log('Tokens:', this._tokens);
    console.log('Goodbye!');
  }

  private processInput(input: string) {
    if (input.trim().toLowerCase() === 'exit') {
      this.print();
      process.exit(0);
    }

    this._input += input;

    this.scan();
  }

  async scan() {
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
