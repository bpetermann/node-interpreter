import {
  LetStatement,
  Program,
  ReturnStatement,
  ExpressionStatement,
  ExpressionType,
  Identifier,
  PrefixExpression,
  IntegerLiteral
} from '../ast';
import { Token, TokenType, isTokenType } from '../token';
import { Lexer } from '../lexer';
import setError from './error';

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
      [TokenType.INT]: this.parseIntegerLiteral.bind(this),
      [TokenType.BANG]: this.parsePrefixExpression.bind(this),
      [TokenType.MINUS]: this.parsePrefixExpression.bind(this),
    };
    this._infixParseFns = {};
  }

  get errors(): string[] {
    return this._errors;
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
      this._errors.push(
        setError({ expected: TokenType.IDENT, got: this._peekToken })
      );
      return null;
    }

    stmt.name = this._peekToken;

    this.nextToken();

    if (!isTokenType(this._peekToken, TokenType.ASSIGN)) {
      this._errors.push(
        setError({ expected: TokenType.ASSIGN, got: this._peekToken })
      );
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

  parseIntegerLiteral(): IntegerLiteral {
    return new IntegerLiteral(this._curToken);
  }

  parsePrefixExpression(): PrefixExpression {
    const expression = new PrefixExpression(this._curToken);

    this.nextToken();

    expression._right = this.parseExpression(ExpressionType.PREFIX);

    return expression;
  }

  parseExpression(_: ExpressionType) {
    const prefix = this._prefixParseFns[this._curToken?.type];

    if (!prefix) {
      this._errors.push(setError({ type: 'parse', got: this._curToken }));
      return null;
    }

    const leftExpression = prefix();

    return leftExpression;
  }

  parseExpressionStatement(): ExpressionStatement | null {
    const stmt = new ExpressionStatement(this._curToken);

    const expression = this.parseExpression(ExpressionType.LOWEST);

    if (expression) {
      stmt.add(expression);
    }

    if (isTokenType(this._peekToken, TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }
}
