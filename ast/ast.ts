import { Statement } from './types';

class Program {
  private _statements: Statement[];
  constructor() {
    this._statements = [];
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
