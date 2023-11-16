import { LetStatement, Statement } from './stmt';

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

  outputStmt() {
    return this._statements.map((stmt) => {
      if (stmt instanceof LetStatement) {
        return {
          token: stmt.tokenLiteral(),
          name: stmt.name.tokenLiteral(),
        };
      }
      return {
        token: stmt.tokenLiteral(),
      };
    });
  }
}

export { Program };
