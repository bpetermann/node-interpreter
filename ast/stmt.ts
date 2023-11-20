import { Token } from '../token';
import { NodeType, Statement } from './stmtType';

class Expression implements NodeType {
  constructor(public token: Token) {}

  getString(): string {
    return this.token.literal;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }
}

class PrefixExpression implements NodeType {
  _operator: string;
  _right: Expression;

  constructor(public token: Token) {}

  getString(): string {
    return `literal: ${this.token.literal} right: ${this._right.getString()}`;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }
}

class Identifier implements NodeType {
  constructor(public token: Token) {}

  getString(): string {
    return this.token.literal;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }
}

class LetStatement implements Statement {
  _name: Identifier;
  _value: Expression;

  constructor(public token: Token) {}

  set name(token: Token) {
    this._name = new Identifier(token);
  }

  get name(): Identifier {
    return this._name;
  }

  set value(token: Token) {
    this._value = new Expression(token);
  }

  get value(): Expression {
    return this._value;
  }

  getString(): string {
    return `${this.tokenLiteral()} ${this._name.getString()} = ${this._value}`;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode() {}
}

class ReturnStatement implements Statement {
  _value: Expression;

  constructor(public token: Token) {}

  set value(token: Token) {
    this._value = new Expression(token);
  }

  get value(): Expression {
    return this._value;
  }

  getString(): string {
    return this.tokenLiteral();
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode() {}
}

class ExpressionStatement implements Statement {
  _expression: Identifier | Expression | PrefixExpression;

  constructor(public token: Token) {}

  add(ident: Identifier) {
    this._expression = ident;
  }

  getString(): string {
    return this._expression.getString();
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode() {}
}

export {
  LetStatement,
  ReturnStatement,
  ExpressionStatement,
  Expression,
  Identifier,
  PrefixExpression,
};
