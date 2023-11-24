import { Expression, Statement } from './types';
import { Token } from '../token';
import colors from 'colors';

class IntegerLiteral implements Expression {
  value: number;

  constructor(public token: Token) {
    this.value = Number(token.literal);
  }

  expressionNode: () => void;

  getString(): string {
    return colors.blue(`${this.value}`);
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
    return colors.blue(`${this.value}`);
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
    return colors.green(`(${this.token.literal} ${this.right?.getString()})`);
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
      `(${this.left?.getString()} ${
        this.token.literal
      } ${this.right?.getString()})`
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
    return colors.blue(`${this.token.literal}`);
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  expressionNode: () => void;
}

class IfExpression implements Expression {
  condition: Expression;
  consequence: Statement;
  alternative?: Statement;

  constructor(public token: Token) {}

  getString(): string {
    return colors.magenta(
      `if ${this.condition.getString()} ${this.consequence.getString()} ${
        this.alternative ? 'else ' + this.alternative.getString() : ''
      }`
    );
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  expressionNode: () => void;
}

class FunctionLiteral implements Expression {
  parameters: Identifier[];
  body: Statement;

  constructor(public token: Token) {}

  getString(): string {
    return colors.magenta(
      `${this.tokenLiteral()}(${this.parameters
        .map((param) => param.getString())
        .join(', ')}) {${this.body.getString()}}`
    );
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  expressionNode: () => void;
}

class CallExpression implements Expression {
  function: Expression;
  arguments: Expression[];

  constructor(public token: Token) {}

  getString(): string {
    return colors.magenta(
      `${this.function.getString()}(${this.arguments
        .map((param) => param.getString())
        .join(', ')})`
    );
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
  BooleanLiteral,
  IfExpression,
  FunctionLiteral,
  CallExpression,
};
