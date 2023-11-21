import { Identifier, Expression } from './expression';
import { Statement } from './types';
import { Token } from '../token';

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
    this._value = new Identifier(token);
  }

  get value(): Expression {
    return this._value;
  }

  getString(): string {
    return `${
      LetStatement.name
    }: name: ${this._name.getString()} value: ${this._value?.getString()}`;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode() {}
}

class ReturnStatement implements Statement {
  _returnValue: Expression;

  constructor(public token: Token) {}

  set value(token: Token) {
    this._returnValue = new Identifier(token);
  }

  get value(): Expression {
    return this._returnValue;
  }

  getString(): string {
    return `${ReturnStatement.name}: name: ${this.tokenLiteral()} value: ${
      this._returnValue
    }`;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode() {}
}

class ExpressionStatement implements Statement {
  _expression: Expression;

  constructor(public token: Token) {}

  add(ident: Identifier) {
    this._expression = ident;
  }

  getString(): string {
    return `${ExpressionStatement.name}:  ${this._expression.getString()}`;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode() {}
}

export { LetStatement, ReturnStatement, ExpressionStatement };
