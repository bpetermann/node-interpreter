import { LetStatement, Program } from '../ast/ast';
import { Token, TokenType, isTokenType } from '../token';
import { Lexer } from '../lexer';

export default class Parser {
  _lexer: Lexer;
  _curToken: Token;
  _peekToken: Token;
  _position: number;
  _program: Program;

  constructor(input: string) {
    this._position = 0;
    this._lexer = new Lexer(input);
    this._program = new Program();
    this._peekToken = this._lexer.tokens[this._position];
  }

  parse() {
    this.nextToken();

    // if (this._curToken.type === TokenType.EOF || !statement) {
    //   return;
    // }

    while (this._curToken.type !== TokenType.EOF) {
      const stmt = this.parseStatement();
      if (stmt) {
        this._program.add(stmt);
      }
      this.nextToken();
    }

    // this.parse();

    this._program.show();
  }

  parseStatement(): LetStatement | null {
    switch (this._curToken.type) {
      case TokenType.LET:
        return this.parseLetStatement();
      default:
        return null;
    }
  }

  parseLetStatement(): LetStatement | null {
    const stmt = new LetStatement(this._curToken);

    if (!isTokenType(this._peekToken, TokenType.IDENT)) {
      console.log('Next token is not an ident');
      return null;
    }

    stmt.name = this._peekToken;

    this.nextToken();

    if (!isTokenType(this._peekToken, TokenType.ASSIGN)) {
      console.log('Next token is not an assign');
      return null;
    }

    while (!isTokenType(this._curToken, TokenType.SEMICOLON)) {
      this.nextToken();
    }

    // stmt.value = this._peekToken;

    return stmt;
  }

  nextToken() {
    this._curToken = this._peekToken;
    this._position += 1;
    this._peekToken = this._lexer.tokens[this._position];
  }
}
