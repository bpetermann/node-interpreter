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

    while (this._curToken.type !== TokenType.EOF) {
      const stmt = this.parseStatement();
      if (stmt) {
        this._program.add(stmt);
      }
      this.nextToken();
    }

    // Debug
    console.log(this._program.statements.map((stmt) => stmt.name.tokenLiteral()));

    return this._program.statements;
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
      return null;
    }

    stmt.name = this._peekToken;

    this.nextToken();

    if (!isTokenType(this._peekToken, TokenType.ASSIGN)) {
      return null;
    }

    while (!isTokenType(this._curToken, TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  nextToken() {
    this._curToken = this._peekToken;
    this._position += 1;
    this._peekToken = this._lexer.tokens[this._position];
  }
}
