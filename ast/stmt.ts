import { Token } from '../token';

interface NodeType {
  tokenLiteral(): string;
}

interface Statement extends NodeType {
  statementNode: () => void;
}

class Expression implements NodeType {
  constructor(public token: Token) {}

  tokenLiteral(): string {
    return this.token.literal;
  }
}

type StatementType = LetStatement | ReturnStatement;

class Identifier implements NodeType {
  constructor(public token: Token) {}

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

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode() {}
}

class ExpressionStatement implements Statement {
  _expression: Expression;

  constructor(public token: Token) {}

  tokenLiteral(): string {
    return this.token.literal;
  }

  statementNode() {}
}

export { LetStatement, ReturnStatement, StatementType, Statement };