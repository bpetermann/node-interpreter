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
  BooleanLiteral,
  IfExpression,
  BlockStatement,
  FunctionLiteral,
  CallExpression,
} from '../ast';
import { Token, TokenType, isTokenType } from '../token';
import { precedences } from './helper';
import { Lexer } from '../lexer';
import setError from './error';

type StatementType = LetStatement | ReturnStatement | ExpressionStatement;

export default class Parser {
  private _lexer: Lexer;
  private _curToken: Token;
  private _peekToken: Token;
  private _position: number;
  private _program: Program;
  private _errors: string[];
  private _prefixParseFns: { [k: string]: () => Identifier };
  private _infixParseFns: { [k: string]: (left: Expression) => Identifier };

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
      [TokenType.TRUE]: this.parseBoolean.bind(this),
      [TokenType.FALSE]: this.parseBoolean.bind(this),
      [TokenType.LPAREN]: this.parseGroupedExpression.bind(this),
      [TokenType.IF]: this.parseIfExpression.bind(this),
      [TokenType.FUNCTION]: this.parseFunction.bind(this),
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
      [TokenType.LPAREN]: this.parseCallExpression.bind(this),
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

  expectPeek(t: TokenType): boolean {
    if (isTokenType(this._peekToken, t)) {
      this.nextToken();
      return true;
    } else {
      this._errors.push(setError({ expected: t, got: this._peekToken }));
      return false;
    }
  }

  parseLetStatement(): LetStatement | null {
    const stmt = new LetStatement(this._curToken);

    if (!this.expectPeek(TokenType.IDENT)) {
      return null;
    }

    stmt.name = new Identifier(this._curToken);

    if (!this.expectPeek(TokenType.ASSIGN)) {
      return null;
    }

    this.nextToken();

    stmt.value = this.parseExpression(ExpressionType.LOWEST);

    if (isTokenType(this._peekToken, TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseReturnStatement(): ReturnStatement | null {
    const stmt = new ReturnStatement(this._curToken);

    this.nextToken();

    stmt.returnValue = this.parseExpression(ExpressionType.LOWEST);

    if (isTokenType(this._peekToken, TokenType.SEMICOLON)) {
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

  parseBoolean(): BooleanLiteral {
    return new BooleanLiteral(this._curToken);
  }

  parseBlockStatement(): BlockStatement {
    const block = new BlockStatement(this._curToken);

    this.nextToken();

    while (
      !isTokenType(this._curToken, TokenType.RBRACE) &&
      !isTokenType(this._curToken, TokenType.EOF)
    ) {
      const stmt = this.parseStatement();

      if (stmt) {
        block.add(stmt);
      }

      this.nextToken();
    }

    return block;
  }

  parseIfExpression(): IfExpression | null {
    const expression = new IfExpression(this._curToken);

    if (!this.expectPeek(TokenType.LPAREN)) {
      return null;
    }

    this.nextToken();

    expression.condition = this.parseExpression(ExpressionType.LOWEST);

    if (!this.expectPeek(TokenType.RPAREN)) {
      return null;
    }

    if (!this.expectPeek(TokenType.LBRACE)) {
      return null;
    }

    expression.consequence = this.parseBlockStatement();

    if (isTokenType(this._peekToken, TokenType.ELSE)) {
      this.nextToken();

      if (!this.expectPeek(TokenType.LBRACE)) {
        return null;
      }

      expression.alternative = this.parseBlockStatement();
    }

    return expression;
  }

  parseCallArguments(): Expression[] {
    const args = [];

    if (isTokenType(this._peekToken, TokenType.RPAREN)) {
      this.nextToken();
      return args;
    }

    this.nextToken();

    args.push(this.parseExpression(ExpressionType.LOWEST));

    while (isTokenType(this._peekToken, TokenType.COMMA)) {
      this.nextToken();
      this.nextToken();
      args.push(this.parseExpression(ExpressionType.LOWEST));
    }

    if (!this.expectPeek(TokenType.RPAREN)) {
      return null;
    }

    return args;
  }

  parseCallExpression(fn: Expression): CallExpression {
    const expression = new CallExpression(this._curToken);
    expression.function = fn;

    expression.arguments = this.parseCallArguments();

    return expression;
  }

  parseFunctionParameters(): Identifier[] {
    const identifiers = [];

    if (isTokenType(this._peekToken, TokenType.RPAREN)) {
      this.nextToken();
      return identifiers;
    }

    this.nextToken();

    const ident = new Identifier(this._curToken);
    identifiers.push(ident);

    while (isTokenType(this._peekToken, TokenType.COMMA)) {
      this.nextToken();
      this.nextToken();
      const ident = new Identifier(this._curToken);
      identifiers.push(ident);
    }

    if (!this.expectPeek(TokenType.RPAREN)) {
      return null;
    }

    return identifiers;
  }

  parseFunction(): FunctionLiteral | null {
    const func = new FunctionLiteral(this._curToken);

    if (!this.expectPeek(TokenType.LPAREN)) {
      return null;
    }

    func.parameters = this.parseFunctionParameters();

    if (!this.expectPeek(TokenType.LBRACE)) {
      return null;
    }

    func.body = this.parseBlockStatement();

    return func;
  }

  parseGroupedExpression(): Expression | null {
    this.nextToken();

    const expression = this.parseExpression(ExpressionType.LOWEST);

    if (!this.expectPeek(TokenType.RPAREN)) {
      return null;
    }

    return expression;
  }

  parsePrefixExpression(): PrefixExpression {
    const expression = new PrefixExpression(this._curToken);

    this.nextToken();

    expression.right = this.parseExpression(ExpressionType.PREFIX);

    return expression;
  }

  parseInfixExpression(left: Expression): InfixExpression {
    const expression = new InfixExpression(this._curToken, left);

    const precedence = precedences(this._curToken.type);

    this.nextToken();

    expression.right = this.parseExpression(precedence);

    return expression;
  }

  parseExpression(precedence: ExpressionType): Expression | null {
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
        return leftExpression;
      }

      this.nextToken();

      leftExpression = infix(leftExpression);
    }

    return leftExpression;
  }

  parseExpressionStatement(): ExpressionStatement | null {
    const stmt = new ExpressionStatement(this._curToken);

    const expression = this.parseExpression(ExpressionType.LOWEST);

    if (expression) {
      stmt.expression = expression;
    }

    if (isTokenType(this._peekToken, TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }
}
