import { Token, TokenType } from '../token';

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
}

class LetStatement implements Statement {
  token: Token;
  name: string;
  value: Expression;

  constructor(token: Token) {
    this.token = token;
    this.name = this.tokenLiteral();
  }

  statementNode() {}
  tokenLiteral(): string {
    return this.token.literal;
  }
}
