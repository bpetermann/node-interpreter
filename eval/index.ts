import {
  BlockStatement,
  BooleanLiteral,
  CallExpression,
  Expression,
  ExpressionStatement,
  FunctionLiteral,
  Identifier,
  IfExpression,
  InfixExpression,
  IntegerLiteral,
  LetStatement,
  NodeType,
  PrefixExpression,
  Program,
  ReturnStatement,
  Statement,
} from '../ast';
import {
  Object,
  ObjectType,
  BooleanObject,
  IntegerObject,
  NullObject,
  ReturnValueObject,
  ErrorObject,
  Environment,
  FunctionObject,
  EnclosedEnvironment,
} from '../object';
import { TokenType } from '../token';

const TRUE = new BooleanObject(true);
const FALSE = new BooleanObject(false);
const NULL = new NullObject();

type EnvType = EnclosedEnvironment | Environment;

class Eval {
  evaluate(program: Program, env: Environment): Object[] {
    const results = program.statements.map((stmt) =>
      this.evaluateNode(stmt, env)
    );
    const returnObject = results.find(
      (result) => result instanceof ReturnValueObject
    );
    const errorObject = results.find((result) => result instanceof ErrorObject);

    return returnObject
      ? [returnObject]
      : errorObject
      ? [errorObject]
      : results;
  }

  evaluateNode(node: NodeType, env: EnvType): Object {
    switch (true) {
      case node instanceof ExpressionStatement:
        return this.evaluateNode((node as ExpressionStatement).expression, env);
      case node instanceof IntegerLiteral:
        return new IntegerObject(+node.tokenLiteral());
      case node instanceof BooleanLiteral:
        return this.booleanToBooleanObject(node.tokenLiteral() === 'true');
      case node instanceof InfixExpression:
        const infix = node as InfixExpression;
        const l = this.evaluateNode(infix.left, env);
        if (this.isError(l)) return l;
        const r = this.evaluateNode(infix.right, env);
        if (this.isError(r)) return r;
        return this.evalInfixExpression(infix.operator, l, r);
      case node instanceof PrefixExpression:
        const right = this.evaluateNode((node as PrefixExpression).right, env);
        if (this.isError(right)) return right;
        return this.evalPrefixExpression(
          (node as PrefixExpression).operator,
          right
        );
      case node instanceof BlockStatement:
        return this.evalStatements((node as BlockStatement).statements, env);
      case node instanceof IfExpression:
        return this.evalIfExpression(node as IfExpression, env);
      case node instanceof ReturnStatement:
        const val = this.evaluateNode(
          (node as ReturnStatement).returnValue,
          env
        );
        if (this.isError(val)) return val;
        return new ReturnValueObject(val);
      case node instanceof Identifier:
        return this.evalIdentifier(node as Identifier, env);
      case node instanceof LetStatement:
        const letStmt = node as LetStatement;
        const letValue = this.evaluateNode(letStmt.value, env);
        if (this.isError(letValue)) {
          return letValue;
        }
        env.set(letStmt.name.value, letValue);
        break;
      case node instanceof FunctionLiteral:
        const { parameters, body } = node as FunctionLiteral;
        return new FunctionObject(parameters, env, body);
      case node instanceof CallExpression:
        const func = this.evaluateNode((node as CallExpression).function, env);
        if (this.isError(func)) {
          return func;
        }
        const args = this.evalExpressions(
          (node as CallExpression).arguments,
          env
        );
        if (args.length === 1 && this.isError(args[0])) {
          return args[0];
        }
        return this.applyFunction(func, args);
      default:
        return NULL;
    }
  }

  evalStatements(stmts: Statement[], env: EnvType): Object {
    const results = stmts.map((stmt) => this.evaluateNode(stmt, env));

    return (
      results.find((result) => result instanceof ReturnValueObject) ??
      results.filter((result) => result instanceof ErrorObject)[0] ??
      results.filter((result) => !(result instanceof NullObject))[0] ??
      NULL
    );
  }

  newError(msg: string): ErrorObject {
    return new ErrorObject(msg);
  }

  isError(obj: Object): boolean {
    if (obj !== null) {
      return obj.type() === ObjectType.ERROR_OBJ;
    }
    return false;
  }

  applyFunction(fn: Object, args: Object[]): Object {
    if (!(fn instanceof FunctionObject)) {
      return this.newError(`not a function: ${fn.type()}`);
    }

    const extendedEnv = this.extendFunctionEnv(fn, args);
    const evaluated = this.evaluateNode(fn.body, extendedEnv);
    return this.unwrapReturnValue(evaluated);
  }

  extendFunctionEnv(fn: FunctionObject, args: Object[]): EnclosedEnvironment {
    const env = new EnclosedEnvironment(fn.env as Environment);

    fn.parameters.map((param, idx) => env.set(param.value, args[idx]));

    return env;
  }

  unwrapReturnValue(obj: Object): Object {
    if (obj instanceof ReturnValueObject) {
      return obj.value;
    }

    return obj;
  }

  evalExpressions(exps: Expression[], env: EnvType): Object[] {
    const result = exps.map((exp) => this.evaluateNode(exp, env));
    const errorObject = result.find((result) => result instanceof ErrorObject);

    return errorObject ? [errorObject] : result;
  }

  evalIdentifier(node: Identifier, env: EnvType): Object {
    const value = env.get(node.value);

    if (!value) {
      return this.newError(`identifier not found: ${node.value}`);
    }

    return value;
  }

  isTruthy(object: Object): boolean {
    switch (object) {
      case NULL:
        return false;
      case TRUE:
        return true;
      case FALSE:
        return false;
      default:
        return true;
    }
  }

  evalIfExpression(expression: IfExpression, env: EnvType): Object {
    const condition = this.evaluateNode(expression.condition, env);

    if (this.isError(condition)) return condition;

    if (this.isTruthy(condition)) {
      return this.evaluateNode(expression.consequence, env);
    } else if (expression.alternative) {
      return this.evaluateNode(expression.alternative, env);
    } else {
      return NULL;
    }
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
        return this.newError(
          `unknown operator: ${left.type()} ${operator} ${right.type()}`
        );
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
      case left.type() !== right.type():
        return this.newError(
          `type mismatch: ${left.type()} ${operator} ${right.type()}`
        );
      default:
        return this.newError(
          `unknown operator: ${left.type()} ${operator} ${right.type()}`
        );
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
      return this.newError(`unknown operator: -${right.type()}`);
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
        return this.newError(`unknown operator: ${operator} ${right.type()}`);
    }
  }
}

export { Eval };
