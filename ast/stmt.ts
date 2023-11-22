import { Identifier, Expression } from './expression';
import { Statement } from './types';
import { Token } from '../token';
import colors from 'colors';

class LetStatement implements Statement {
  name: Identifier;
  value: Expression;

  constructor(public token: Token) {}

  getString(): string {
    return colors.blue(
      `${
        LetStatement.name
      }:\nname: ${this.name.getString()}\nvalue: ${this.value?.getString()}`
    );
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode() {}
}

class ReturnStatement implements Statement {
  returnValue: Expression;

  constructor(public token: Token) {}

  getString(): string {
    return colors.blue(
      `${ReturnStatement.name}:\nname: ${this.tokenLiteral()}\nvalue: ${
        this.returnValue
      }`
    );
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode() {}
}

class ExpressionStatement implements Statement {
  expression: Expression;

  constructor(public token: Token) {}

  getString(): string {
    return colors.blue(
      `${ExpressionStatement.name}:\n${this.expression.getString()}`
    );
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode() {}
}

export { LetStatement, ReturnStatement, ExpressionStatement };
