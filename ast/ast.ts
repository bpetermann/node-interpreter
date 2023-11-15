import { Token } from '../token';

interface NodeType {
  tokenLiteral(): string;
}

interface Statement extends NodeType {
  statementNode: () => void;
}

interface Expression extends NodeType {
  expressionNode: () => void;
}

class Program {
  statements: Statement[];
  constructor() {
    this.statements = [];
  }

  add(statement: Statement) {
    this.statements.push(statement);
  }

  show() {
    console.log(this.statements.map((item) => item.tokenLiteral()));
  }
}

class Identifier implements NodeType {
  _value: string;

  constructor(public token: Token) {}

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

  tokenLiteral(): string {
    return this.token.literal;
  }

  set value(token: Token) {
    this._value = token;
  }

  statementNode() {}
}

export { Program, LetStatement };
