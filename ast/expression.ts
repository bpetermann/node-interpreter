import { Token } from '../token';
import { NodeType } from './types';
import colors from 'colors';

interface Expression extends NodeType {
  expressionNode: () => void;
}

class IntegerLiteral implements Expression {
  value: number;

  constructor(public token: Token) {
    this.value = Number(token.literal);
  }

  expressionNode: () => void;

  getString(): string {
    return colors.white(`\n${IntegerLiteral.name}:\nvalue: ${this.value}`);
  }

  tokenLiteral(): string {
    return this.token.literal;
  }
}

class BooleanLiteral implements Expression {
  value: boolean;

  constructor(public token: Token) {
    this.value = !!token.literal;
  }

  expressionNode: () => void;

  getString(): string {
    return colors.white(`\n${IntegerLiteral.name}:\nvalue: ${this.value}`);
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
    return colors.green(
      `\n${PrefixExpression.name}:\noperator: ${
        this.token.literal
      }\nexpression:${this.right?.getString()}`
    );
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  expressionNode: () => void;
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
    return colors.green(
      `\n${InfixExpression.name}:\nleft: ${this.left?.getString()}\noperator: ${
        this.token.literal
      }\nright: ${this.right?.getString()}`
    );
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  expressionNode: () => void;
}

class Identifier implements Expression {
  value: string;

  constructor(public token: Token) {
    this.value = token.literal;
  }

  getString(): string {
    return colors.white(`\n${Identifier.name}:\nvalue: ${this.token.literal}`);
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  expressionNode: () => void;
}

export {
  Expression,
  Identifier,
  PrefixExpression,
  IntegerLiteral,
  InfixExpression,
  BooleanLiteral
};
