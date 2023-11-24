import {
  ExpressionStatement,
  IntegerLiteral,
  NodeType,
  Program,
  Statement,
} from '../ast';
import { IntegerObject, Object } from '../object';

const evaluate = (node: NodeType): Object => {
  switch (true) {
    case node instanceof Program:
      return evalStatements((node as Program).statements);
    case node instanceof ExpressionStatement:
      return evaluate((node as ExpressionStatement).expression);
    case node instanceof IntegerLiteral:
      return new IntegerObject(+node.tokenLiteral());
    default:
      return null;
  }
};

const evalStatements = (stmts: Statement[]): Object => {
  // to do: return all stmts
  return stmts.map((stmt) => evaluate(stmt))[0];
};

export default evaluate;
