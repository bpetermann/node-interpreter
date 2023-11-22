import { Token } from '../token';
import { NodeType } from './types';

interface Expression extends NodeType {
  statementNode: () => void;
}

class IntegerLiteral implements Expression {
  value: number;

  constructor(public token: Token) {
    this.value = Number(token.literal);
  }

  statementNode: () => void;

  getString(): string {
    return `${IntegerLiteral.name}:\nvalue: ${this.value}`;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }
}

class PrefixExpression implements Expression {
  operator: string;
  right: Expression;

  constructor(public token: Token) {
    this.operator = this.token.literal;
  }

  getString(): string {
    return `${PrefixExpression.name}:\noperator: ${this.token.literal}\nexpression:\n${this.right?.getString()}`;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode: () => void;
}

class InfixExpression implements Expression {
  left: Expression;
  operator: string;
  right: Expression;

  constructor(public token: Token, left: Expression) {
    this.operator = this.token.literal;
    this.left = left;
  }

  getString(): string {
    return `\n${
      InfixExpression.name
    }:\nleft: ${this.left?.getString()} operator: ${
      this.token.literal
    }\nright: ${this.right?.getString()}`;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode: () => void;
}

class Identifier implements Expression {
  value: string;

  constructor(public token: Token) {
    this.value = token.literal;
  }

  getString(): string {
    return `${Identifier.name}:\nvalue: ${this.token.literal}`;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode: () => void;
}

export {
  Expression,
  Identifier,
  PrefixExpression,
  IntegerLiteral,
  InfixExpression,
};
