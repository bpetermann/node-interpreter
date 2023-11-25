import {
  BooleanLiteral,
  ExpressionStatement,
  InfixExpression,
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
        return this.booleanToBooleanObject(node.tokenLiteral() === 'true');
      case node instanceof InfixExpression:
        const infix = node as InfixExpression;
        const l = this.evaluate(infix.left);
        const r = this.evaluate(infix.right);
        return this.evalInfixExpression(infix.operator, l, r);
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

  booleanToBooleanObject(assertion: boolean): BooleanObject {
    return assertion ? TRUE : FALSE;
  }

  evalIntegerInfixExpression(
    operator: string,
    left: Object,
    right: Object
  ): Object {
    const leftVal = (left as IntegerObject).value;
    const rightVal = (right as IntegerObject).value;

    switch (operator) {
      case TokenType.PLUS:
        return new IntegerObject(leftVal + rightVal);
      case TokenType.MINUS:
        return new IntegerObject(leftVal - rightVal);
      case TokenType.ASTERISK:
        return new IntegerObject(leftVal * rightVal);
      case TokenType.SLASH:
        return new IntegerObject(leftVal / rightVal);
      case TokenType.LT:
        return this.booleanToBooleanObject(leftVal < rightVal);
      case TokenType.GT:
        return this.booleanToBooleanObject(leftVal > rightVal);
      case TokenType.EQ:
        return this.booleanToBooleanObject(leftVal === rightVal);
      case TokenType.NOT_EQ:
        return this.booleanToBooleanObject(leftVal !== rightVal);
      default:
        return NULL;
    }
  }

  evalInfixExpression(operator: string, left: Object, right: Object): Object {
    switch (true) {
      case left.type() === ObjectType.INTEGER_OBJ &&
        right.type() === ObjectType.INTEGER_OBJ:
        return this.evalIntegerInfixExpression(operator, left, right);
      case operator == TokenType.EQ:
        return this.booleanToBooleanObject(left === right);
      case operator == TokenType.NOT_EQ:
        return this.booleanToBooleanObject(left !== right);
      default:
        return null;
    }
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
