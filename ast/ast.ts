import { Token } from '../token';

interface NodeType {
  tokenLiteral(): string;
}

interface Statement extends NodeType {
  name: Identifier;
  value: Expression;
  statementNode: () => void;
}

class Expression implements NodeType {
  constructor(public token: Token) {}

  tokenLiteral(): string {
    return this.token.literal;
  }
}

class Identifier implements NodeType {
  constructor(public token: Token) {}

  tokenLiteral(): string {
    return this.token.literal;
  }
}

class Program {
  _statements: Statement[];
  constructor() {
    this._statements = [];
  }

  add(statement: Statement) {
    this._statements.push(statement);
  }

  get statements() {
    return this._statements;
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

export { Program, LetStatement };
