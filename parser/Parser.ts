import { Token, TokenType, isTokenType } from '../token';
import { precedences } from './helper';
import { Lexer } from '../lexer';
import setError from './error';
import * as ast from '../ast';

type StatementType =
  | ast.LetStatement
  | ast.ReturnStatement
  | ast.ExpressionStatement;

export default class Parser {
  private _lexer: Lexer;
  private _curToken: Token;
  private _peekToken: Token;
  private _position: number;
  private _program: ast.Program;
  private _errors: string[];
  private _prefixParseFns: { [k: string]: () => ast.Identifier };
  private _infixParseFns: {
    [k: string]: (left: ast.Expression) => ast.Identifier;
  };

  constructor(input: string) {
    this._position = 0;
    this._lexer = new Lexer(input);
    this._program = new ast.Program();
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
      [TokenType.STRING]: this.parseStringLiteral.bind(this),
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

  parse(): ast.Program {
    this.nextToken();

    while (!isTokenType(this._curToken, TokenType.EOF)) {
      const stmt = this.parseStatement();
      if (stmt) {
        this._program.add(stmt);
      }

      this.nextToken();
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

  parseLetStatement(): ast.LetStatement | null {
    const stmt = new ast.LetStatement(this._curToken);

    if (!this.expectPeek(TokenType.IDENT)) {
      return null;
    }

    stmt.name = new ast.Identifier(this._curToken);

    if (!this.expectPeek(TokenType.ASSIGN)) {
      return null;
    }

    this.nextToken();

    stmt.value = this.parseExpression(ast.ExpressionType.LOWEST);

    if (isTokenType(this._peekToken, TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseReturnStatement(): ast.ReturnStatement | null {
    const stmt = new ast.ReturnStatement(this._curToken);

    this.nextToken();

    stmt.returnValue = this.parseExpression(ast.ExpressionType.LOWEST);

    if (isTokenType(this._peekToken, TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseIdentifier(): ast.Identifier {
    return new ast.Identifier(this._curToken);
  }

  parseIntegerLiteral(): ast.IntegerLiteral {
    return new ast.IntegerLiteral(this._curToken);
  }

  parseBoolean(): ast.BooleanLiteral {
    return new ast.BooleanLiteral(this._curToken);
  }

  parseBlockStatement(): ast.BlockStatement {
    const block = new ast.BlockStatement(this._curToken);

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

  parseIfExpression(): ast.IfExpression | null {
    const expression = new ast.IfExpression(this._curToken);

    if (!this.expectPeek(TokenType.LPAREN)) {
      return null;
    }

    this.nextToken();

    expression.condition = this.parseExpression(ast.ExpressionType.LOWEST);

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

  parseCallArguments(): ast.Expression[] {
    const args = [];

    if (isTokenType(this._peekToken, TokenType.RPAREN)) {
      this.nextToken();
      return args;
    }

    this.nextToken();

    args.push(this.parseExpression(ast.ExpressionType.LOWEST));

    while (isTokenType(this._peekToken, TokenType.COMMA)) {
      this.nextToken();
      this.nextToken();
      args.push(this.parseExpression(ast.ExpressionType.LOWEST));
    }

    if (!this.expectPeek(TokenType.RPAREN)) {
      return null;
    }

    return args;
  }

  parseCallExpression(fn: ast.Expression): ast.CallExpression {
    const expression = new ast.CallExpression(this._curToken);
    expression.function = fn;

    expression.arguments = this.parseCallArguments();

    return expression;
  }

  parseFunctionParameters(): ast.Identifier[] {
    const identifiers = [];

    if (isTokenType(this._peekToken, TokenType.RPAREN)) {
      this.nextToken();
      return identifiers;
    }

    this.nextToken();

    const ident = new ast.Identifier(this._curToken);
    identifiers.push(ident);

    while (isTokenType(this._peekToken, TokenType.COMMA)) {
      this.nextToken();
      this.nextToken();
      const ident = new ast.Identifier(this._curToken);
      identifiers.push(ident);
    }

    if (!this.expectPeek(TokenType.RPAREN)) {
      return null;
    }

    return identifiers;
  }

  parseFunction(): ast.FunctionLiteral | null {
    const func = new ast.FunctionLiteral(this._curToken);

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

  parseGroupedExpression(): ast.Expression | null {
    this.nextToken();

    const expression = this.parseExpression(ast.ExpressionType.LOWEST);

    if (!this.expectPeek(TokenType.RPAREN)) {
      return null;
    }

    return expression;
  }

  parsePrefixExpression(): ast.PrefixExpression {
    const expression = new ast.PrefixExpression(this._curToken);

    this.nextToken();

    expression.right = this.parseExpression(ast.ExpressionType.PREFIX);

    return expression;
  }

  parseInfixExpression(left: ast.Expression): ast.InfixExpression {
    const expression = new ast.InfixExpression(this._curToken, left);

    const precedence = precedences(this._curToken.type);

    this.nextToken();

    expression.right = this.parseExpression(precedence);

    return expression;
  }

  parseStringLiteral(): ast.StringLiteral {
    return new ast.StringLiteral(this._curToken);
  }

  parseExpression(precedence: ast.ExpressionType): ast.Expression | null {
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

  parseExpressionStatement(): ast.ExpressionStatement | null {
    const stmt = new ast.ExpressionStatement(this._curToken);

    const expression = this.parseExpression(ast.ExpressionType.LOWEST);

    if (expression) {
      stmt.expression = expression;
    }

    if (isTokenType(this._peekToken, TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }
}
