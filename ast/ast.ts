import { Token } from '../token';

interface NodeType {
  tokenLiteral(): string;
}

interface Statement extends NodeType {
  name: Identifier
  statementNode: () => void;
}

interface Expression extends NodeType {
  expressionNode: () => void;
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

class Identifier implements NodeType {
  _value: string;
  value: string;

  constructor(public token: Token) {
    this.value = this.tokenLiteral();
  }

  tokenLiteral(): string {
    return this.token.literal;
  }
}

class LetStatement implements Statement {
  _name: Identifier;
  _value: Token;

  constructor(public token: Token) {}

  set name(token: Token) {
    this._name = new Identifier(token);
  }

  get name(): Identifier {
    return this._name;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  set value(token: Token) {
    this._value = token;
  }

  statementNode() {}
}

export { Program, LetStatement };
