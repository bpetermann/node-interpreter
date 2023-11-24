import {
  BooleanLiteral,
  ExpressionStatement,
  IntegerLiteral,
  NodeType,
  PrefixExpression,
  Program,
  Statement,
} from '../ast';
import {
  ObjectType,
  BooleanObject,
  IntegerObject,
  NullObject,
  Object,
} from '../object';
import { TokenType } from '../token';

const TRUE = new BooleanObject(true);
const FALSE = new BooleanObject(false);
const NULL = new NullObject();

class Eval {
  evaluate(node: NodeType): Object {
    switch (true) {
      case node instanceof Program:
        return this.evalStatements((node as Program).statements);
      case node instanceof ExpressionStatement:
        return this.evaluate((node as ExpressionStatement).expression);
      case node instanceof IntegerLiteral:
        return new IntegerObject(+node.tokenLiteral());
      case node instanceof BooleanLiteral:
        return node.tokenLiteral() === 'true' ? TRUE : FALSE;
      case node instanceof PrefixExpression:
        const right = this.evaluate((node as PrefixExpression).right);
        return this.evalPrefixExpression(
          (node as PrefixExpression).operator,
          right
        );
      default:
        return NULL;
    }
  }

  evalStatements(stmts: Statement[]): Object {
    // to do: return all stmts
    return stmts.map((stmt) => this.evaluate(stmt))[0];
  }

  bangOperatorExpression(right: Object): Object {
    switch (right) {
      case TRUE:
        return FALSE;
      case FALSE:
        return TRUE;
      case NULL:
        return TRUE;
      default:
        return FALSE;
    }
  }

  minusPrefixOperatorExpression(right: Object): Object {
    if (right.type() !== ObjectType.INTEGER_OBJ) {
      return NULL;
    }
    const value = (right as IntegerObject).value;
    return new IntegerObject(-value);
  }

  evalPrefixExpression(operator: string, right: Object): Object {
    switch (operator) {
      case TokenType.BANG:
        return this.bangOperatorExpression(right);
      case TokenType.MINUS:
        return this.minusPrefixOperatorExpression(right);
      default:
        return null;
    }
  }
}

export { Eval };
