import { NodeType, Statement } from '../../types';

class Program implements NodeType {
  private _statements: Statement[];
  constructor() {
    this._statements = [];
  }
  tokenLiteral(): string {
    return this._statements.length ? this._statements[0].tokenLiteral() : ``;
  }

  add(statement: Statement) {
    this._statements.push(statement);
  }

  get statements() {
    return this._statements;
  }

  getString(): string {
    return this._statements.map((stmt) => stmt.getString()).join('\n');
  }
}

export { Program };
