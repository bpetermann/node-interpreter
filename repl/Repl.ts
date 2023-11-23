import Parser from '../parser/Parser';
import { TokenType } from '../token';
import readline from 'readline';
export default class Repl {
  private print(line: string) {
    const parser = new Parser(line);
    const program = parser.parse();

    if (parser.errors.length) {
      console.log(parser.errors);
    } else {
      console.log(program.getString());
    }
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
