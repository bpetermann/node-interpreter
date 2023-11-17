import {
  LetStatement,
  Program,
  ReturnStatement,
  ExpressionStatement,
  ExpressionType,
  Expression,
  Identifier,
} from '../ast';
import { Token, TokenType, isTokenType } from '../token';
import { Lexer } from '../lexer';

type StatementType = LetStatement | ReturnStatement | ExpressionStatement;

export default class Parser {
  _lexer: Lexer;
  _curToken: Token;
  _peekToken: Token;
  _position: number;
  _program: Program;
  _errors: string[];
  _prefixParseFns: { [k: string]: () => Identifier };
  _infixParseFns: { [k: string]: () => Identifier };

  constructor(input: string) {
    this._position = 0;
    this._lexer = new Lexer(input);
    this._program = new Program();
    this._peekToken = this._lexer.tokens[this._position];
    this._errors = [];
    this._prefixParseFns = {
      [TokenType.IDENT]: this.parseIdentifier.bind(this),
    };
    this._infixParseFns = {};
  }

  get errors(): string[] {
    return this._errors;
  }

  setError(expected: string, got: Token) {
    this._errors.push(
      `expected next token to be "${expected}" got "${got.literal}" instead`
    );
  }

  nextToken(): void {
    this._curToken = this._peekToken;
    this._position += 1;
    this._peekToken = this._lexer.tokens[this._position];
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
    console.log(this._program.getString());

    return this._program;
  }

  parseStatement(): StatementType | null {
    switch (this._curToken.type) {
      case TokenType.LET:
        return this.parseLetStatement();
      case TokenType.RETURN:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
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

  parseReturnStatement(): ReturnStatement | null {
    const stmt = new ReturnStatement(this._curToken);

    this.nextToken();

    while (!isTokenType(this._curToken, TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseIdentifier(): Identifier {
    return new Identifier(this._curToken);
  }

  parseExpression(_: ExpressionType) {
    const prefix = this._prefixParseFns[this._curToken?.type];

    if (!prefix) {
      return null;
    }

    const leftExpression = prefix();

    return leftExpression;
  }

  parseExpressionStatement(): ExpressionStatement | null {
    const stmt = new ExpressionStatement(this._curToken);

    const expression = this.parseExpression(ExpressionType.LOWEST);

    if (expression) {
      stmt.addExpression(expression);
    }

    if (isTokenType(this._peekToken, TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }
}
