import { Identifier, Expression } from './expression';
import { Statement, Token } from '../../types';
import colors from 'colors';

class LetStatement implements Statement {
  name: Identifier;
  value: Expression;

  constructor(public token: Token) {}

  getString(): string {
    return colors.magenta(
      `let ${this.name.getString()} = ${this.value?.getString()}`
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
    return colors.magenta(`return ${this.returnValue.getString()}`);
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
    return colors.blue(`${this.expression.getString()}`);
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode() {}
}

class BlockStatement implements Statement {
  statements: Statement[];

  constructor(public token: Token) {
    this.statements = [];
  }

  add(stmt: Statement) {
    this.statements.push(stmt);
  }

  getString(): string {
    return `${this.statements.map((stmt) => stmt.getString()).join(', ')}`;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode() {}
}

export { LetStatement, ReturnStatement, ExpressionStatement, BlockStatement };
