import { Token, TokenType, isTokenType } from '../token';
import { LetStatement, Program } from '../ast';
import { Lexer } from '../lexer';

export default class Parser {
  _lexer: Lexer;
  _curToken: Token;
  _peekToken: Token;
  _position: number;
  _program: Program;
  _errors: string[];

  constructor(input: string) {
    this._position = 0;
    this._lexer = new Lexer(input);
    this._program = new Program();
    this._peekToken = this._lexer.tokens[this._position];
    this._errors = [];
  }

  get errors(): string[] {
    return this._errors;
  }

  setError(expected: string, got: Token) {
    this._errors.push(
      `expected next token to be "${expected}" got "${got.literal}" instead`
    );
  }

  parse(): Program {
    this.nextToken();

    while (!isTokenType(this._curToken, TokenType.EOF)) {
      const stmt = this.parseStatement();
      if (stmt) {
        this._program.add(stmt);
      }
      this.nextToken();
    }

    // Debug
    console.log(
      this._program.statements.map((stmt) => stmt.name.tokenLiteral())
    );

    return this._program;
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
      this.setError(TokenType.IDENT, this._peekToken);
      return null;
    }

    stmt.name = this._peekToken;

    this.nextToken();

    if (!isTokenType(this._peekToken, TokenType.ASSIGN)) {
      this.setError(TokenType.ASSIGN, this._peekToken);
      return null;
    }

    while (!isTokenType(this._curToken, TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  nextToken(): void {
    this._curToken = this._peekToken;
    this._position += 1;
    this._peekToken = this._lexer.tokens[this._position];
  }
}
