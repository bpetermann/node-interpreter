import {
  LetStatement,
  Program,
  ReturnStatement,
  ExpressionStatement,
  Expression,
  ExpressionType,
  Identifier,
  PrefixExpression,
  IntegerLiteral,
  InfixExpression,
} from '../ast';
import { Token, TokenType, isTokenType } from '../token';
import { precedences } from './helper';
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
  _leftExpression: Expression;

  constructor(input: string) {
    this._position = 0;
    this._lexer = new Lexer(input);
    this._program = new Program();
    this._peekToken = this._lexer.tokens[this._position];
    this._errors = [];
    this._leftExpression = undefined;
    this._prefixParseFns = {
      [TokenType.IDENT]: this.parseIdentifier.bind(this),
      [TokenType.INT]: this.parseIntegerLiteral.bind(this),
      [TokenType.BANG]: this.parsePrefixExpression.bind(this),
      [TokenType.MINUS]: this.parsePrefixExpression.bind(this),
    };
    this._infixParseFns = {
      [TokenType.PLUS]: this.parseInfixExpression.bind(this),
      [TokenType.MINUS]: this.parseInfixExpression.bind(this),
      [TokenType.SLASH]: this.parseInfixExpression.bind(this),
      [TokenType.ASTERISK]: this.parseInfixExpression.bind(this),
      [TokenType.EQ]: this.parseInfixExpression.bind(this),
      [TokenType.NOT_EQ]: this.parseInfixExpression.bind(this),
      [TokenType.LT]: this.parseInfixExpression.bind(this),
      [TokenType.GT]: this.parseInfixExpression.bind(this),
    };
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
    if (this._errors.length) {
      console.log(this._errors);
    } else {
      console.log(this._program.getString());
    }

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

  curPrecedence(): number {
    return precedences(this._curToken.type);
  }

  peekPercedence(): number {
    return precedences(this._peekToken.type);
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

    expression.right = this.parseExpression(ExpressionType.PREFIX);

    return expression;
  }

  parseInfixExpression(): InfixExpression {
    const expression = new InfixExpression(
      this._curToken,
      this._leftExpression
    );

    this._leftExpression = undefined;

    const precedence = precedences(this._curToken.type);

    this.nextToken();

    expression.right = this.parseExpression(precedence);

    return expression;
  }

  parseExpression(precedence: ExpressionType) {
    const prefix = this._prefixParseFns[this._curToken?.type];

    if (!prefix) {
      this._errors.push(setError({ type: 'parse', got: this._curToken }));
      return null;
    }

    let leftExpression = prefix();

    while (
      !isTokenType(this._peekToken, TokenType.SEMICOLON) &&
      precedence < this.peekPercedence()
    ) {
      const infix =
        this._infixParseFns[(this._peekToken as any).type as TokenType];

      if (!infix) {
        return null;
      }

      this.nextToken();

      this._leftExpression = leftExpression;

      leftExpression = infix();
    }

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
