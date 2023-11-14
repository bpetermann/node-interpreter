import { Lexer } from '../lexer';
import { Token } from '../token';
import readline from 'readline';

export default class Repl {
  private _lexer: Lexer;
  private _tokens: Token[];

  constructor() {
    this._lexer = new Lexer();
    this._tokens = [];
  }

  private processInput(input: string) {
    if (input.trim().toLowerCase() === 'exit') {
      console.log('Goodbye!');
      process.exit(0);
    }

    this._tokens = this._lexer.start(input);
    console.log('Tokens:', this._tokens);

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
