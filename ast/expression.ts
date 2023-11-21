import { Token } from '../token';
import { NodeType } from './types';

interface Expression extends NodeType {
  statementNode: () => void;
}

class PrefixExpression implements Expression {
  _operator: string;
  _right: Expression;

  constructor(public token: Token) {}

  getString(): string {
    return `prefix: ${
      this.token.literal
    } expression: ${this._right?.getString()}`;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode: () => void;
}

class Identifier implements Expression {
  constructor(public token: Token) {}

  getString(): string {
    return this.token.literal;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode: () => void;
}

export { Expression, Identifier, PrefixExpression };
