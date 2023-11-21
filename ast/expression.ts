import { Token } from '../token';
import { NodeType } from './types';

interface Expression extends NodeType {
  statementNode: () => void;
}

class IntegerLiteral implements Expression {
  _value: number;

  constructor(public token: Token) {
    this._value = Number(token.literal);
  }

  statementNode: () => void;

  getString(): string {
    return `${IntegerLiteral.name}: value: ${this._value}`;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }
}

class PrefixExpression implements Expression {
  _operator: string;
  _right: Expression;

  constructor(public token: Token) {}

  getString(): string {
    return `${PrefixExpression.name}:
    operator: ${this.token.literal} expression: ${this._right?.getString()}`;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode: () => void;
}

class Identifier implements Expression {
  _value: string;

  constructor(public token: Token) {
    this._value = token.literal;
  }

  getString(): string {
    return `${Identifier.name}: value: ${this.token.literal}`;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode: () => void;
}

export { Expression, Identifier, PrefixExpression, IntegerLiteral };
