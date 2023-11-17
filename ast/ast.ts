import { Statement } from './stmt';

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

  getString() {
    return this._statements.map((stmt) => stmt.getString());
  }
}

export { Program };
