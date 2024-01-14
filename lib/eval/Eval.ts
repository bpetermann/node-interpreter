import {
  NodeType,
  Statement,
  ErrorType,
  Object,
  Env,
  ObjectType,
  TokenType,
} from '../../types';
import { builtins } from './builtins';
import * as obj from '../object';
import * as ast from '../ast';

const TRUE = new obj.Boolean(true);
const FALSE = new obj.Boolean(false);
const NULL = new obj.Null();
const HASHKEY = new obj.HashKey();

export default class Eval {
  evaluate(program: ast.Program, env: obj.Environment): Object[] {
    const results = [];

    for (const statement of program.statements) {
      const result = this.evaluateNode(statement, env);
      results.push(result);

      if (result instanceof obj.ReturnValue || result instanceof obj.Error) {
        return [result];
      }
    }

    return results;
  }

  evaluateNode(node: NodeType, env: Env): Object {
    switch (true) {
      case node instanceof ast.ExpressionStatement:
        return this.evaluateNode(
          (node as ast.ExpressionStatement).expression,
          env
        );
      case node instanceof ast.IntegerLiteral:
        return new obj.Integer(+node.tokenLiteral());
      case node instanceof ast.BooleanLiteral:
        return this.booleanToBooleanObject(node.tokenLiteral() === 'true');
      case node instanceof ast.StringLiteral:
        return new obj.String((node as ast.StringLiteral).value);
      case node instanceof ast.InfixExpression:
        const {
          left: infixLeft,
          right: infixRight,
          operator: infixOperator,
        } = node as ast.InfixExpression;
        const l = this.evaluateNode(infixLeft, env);
        if (this.isError(l)) return l;
        const r = this.evaluateNode(infixRight, env);
        if (this.isError(r)) return r;
        return this.evalInfixExpression(infixOperator, l, r);
      case node instanceof ast.PrefixExpression:
        const { right: prefixRight, operator: prefixOperator } =
          node as ast.PrefixExpression;
        const right = this.evaluateNode(prefixRight, env);
        if (this.isError(right)) return right;
        return this.evalPrefixExpression(prefixOperator, right);
      case node instanceof ast.BlockStatement:
        return this.evalStatements(
          (node as ast.BlockStatement).statements,
          env
        );
      case node instanceof ast.IfExpression:
        return this.evalIfExpression(node as ast.IfExpression, env);
      case node instanceof ast.ReturnStatement:
        const { returnValue } = node as ast.ReturnStatement;
        const val = this.evaluateNode(returnValue, env);
        if (this.isError(val)) return val;
        return new obj.ReturnValue(val);
      case node instanceof ast.Identifier:
        return this.evalIdentifier(node as ast.Identifier, env);
      case node instanceof ast.LetStatement:
        const { name, value } = node as ast.LetStatement;
        const letValue = this.evaluateNode(value, env);
        if (this.isError(letValue)) return letValue;
        env.set(name.value, letValue);
        break;
      case node instanceof ast.FunctionLiteral:
        const { parameters, body } = node as ast.FunctionLiteral;
        return new obj.Func(parameters, env, body);
      case node instanceof ast.CallExpression:
        const { function: fn, arguments: callArgs } =
          node as ast.CallExpression;
        const func = this.evaluateNode(fn, env);
        if (this.isError(func)) return func;
        const args = this.evalExpressions(callArgs, env);
        if (args.length === 1 && this.isError(args[0])) return args[0];
        return this.applyFunction(func, args);
      case node instanceof ast.ArrayLiteral:
        const elements = this.evalExpressions(
          (node as ast.ArrayLiteral).elements,
          env
        );
        if (elements.length === 1 && this.isError(elements[0]))
          return elements[0];
        return new obj.Array(elements);
      case node instanceof ast.IndexExpression:
        const idxExp = node as ast.IndexExpression;
        const left = this.evaluateNode(idxExp.left, env);
        if (this.isError(left)) return left;
        const index = this.evaluateNode(idxExp.index, env);
        if (this.isError(index)) return index;
        return this.evalIndexExpression(left, index);
      case node instanceof ast.HashLiteral:
        return this.evalHashLiteral(node as ast.HashLiteral, env);
      default:
        return NULL;
    }
  }

  evalStatements(stmts: Statement[], env: Env): Object {
    let evaluatedResult = NULL;

    for (const stmt of stmts) {
      const result = this.evaluateNode(stmt, env);

      if (result instanceof obj.ReturnValue || result instanceof obj.Error) {
        return result;
      }

      if (result) evaluatedResult = result;
    }

    return evaluatedResult;
  }

  evalHashLiteral(node: ast.HashLiteral, env: Env): Object {
    const pairs = new Map();

    for (const [keyNode, valueNode] of node.pairs) {
      const key = this.evaluateNode(keyNode, env);

      if (this.isError(key)) return key;

      if (!HASHKEY.hashable(key)) {
        return this.newError({ type: 'unusable', msg: `${key.type()}` });
      }

      const value = this.evaluateNode(valueNode, env);

      if (this.isError(value)) return value;

      const hash = HASHKEY.hash(key);
      const pair = new obj.HashPair(key, value);
      pairs.set(hash, pair);
    }

    return new obj.Hash(pairs);
  }

  newError(error: ErrorType): obj.Error {
    return new obj.Error(error);
  }

  isError(object: Object): boolean {
    if (object !== null) {
      return object.type() === ObjectType.ERROR_OBJ;
    }
    return false;
  }

  applyFunction(fn: Object, args: Object[]): Object {
    switch (true) {
      case fn instanceof obj.Func:
        const func = fn as obj.Func;
        const extendedEnv = this.extendFunctionEnv(func, args);
        const evaluated = this.evaluateNode(func.body, extendedEnv);
        return this.unwrapReturnValue(evaluated);
      case fn instanceof obj.Builtin:
        const builtin = fn as obj.Builtin;
        return builtin.fn(...args);
      default:
        return this.newError({ type: 'function', msg: fn.type() });
    }
  }

  extendFunctionEnv(fn: obj.Func, args: Object[]): obj.EnclosedEnvironment {
    const env = new obj.EnclosedEnvironment(fn.env as obj.Environment);

    fn.parameters.map((param, idx) => env.set(param.value, args[idx]));

    return env;
  }

  unwrapReturnValue(object: Object): Object {
    if (object instanceof obj.ReturnValue) {
      return object.value;
    }

    return object;
  }

  evalExpressions(exps: ast.Expression[], env: Env): Object[] {
    const result = exps.map((exp) => this.evaluateNode(exp, env));
    const Error = result.find((result) => result instanceof obj.Error);

    return Error ? [Error] : result;
  }

  evalIdentifier(node: ast.Identifier, env: Env): Object {
    if (env.get(node.value)) {
      return env.get(node.value);
    }

    if (builtins[node.value]) {
      return builtins[node.value];
    }

    return this.newError({ type: 'identifier', msg: node.value });
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

  evalIfExpression(expression: ast.IfExpression, env: Env): Object {
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

  booleanToBooleanObject(assertion: boolean): obj.Boolean {
    return assertion ? TRUE : FALSE;
  }

  evalIntegerInfixExpression(
    operator: string,
    left: Object,
    right: Object
  ): Object {
    const leftVal = (left as obj.Integer).value;
    const rightVal = (right as obj.Integer).value;

    switch (operator) {
      case TokenType.PLUS:
        return new obj.Integer(leftVal + rightVal);
      case TokenType.MINUS:
        return new obj.Integer(leftVal - rightVal);
      case TokenType.ASTERISK:
        return new obj.Integer(leftVal * rightVal);
      case TokenType.SLASH:
        return new obj.Integer(leftVal / rightVal);
      case TokenType.LT:
        return this.booleanToBooleanObject(leftVal < rightVal);
      case TokenType.GT:
        return this.booleanToBooleanObject(leftVal > rightVal);
      case TokenType.EQ:
        return this.booleanToBooleanObject(leftVal === rightVal);
      case TokenType.NOT_EQ:
        return this.booleanToBooleanObject(leftVal !== rightVal);
      default:
        return this.newError({
          type: 'operator',
          msg: `${left.type()} ${operator} ${right.type()}`,
        });
    }
  }

  evalStringInfixExpression(
    operator: string,
    left: Object,
    right: Object
  ): Object {
    if (operator !== '+') {
      return this.newError({
        type: 'operator',
        msg: `${left.type()} ${operator} ${right.type()}`,
      });
    }
    const { value: leftVal } = left as obj.String;
    const { value: rightVal } = right as obj.String;

    return new obj.String(leftVal + rightVal);
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
      case left.type() === ObjectType.STRING_OBJ &&
        right.type() === ObjectType.STRING_OBJ:
        return this.evalStringInfixExpression(operator, left, right);
      case left.type() !== right.type():
        return this.newError({
          type: 'mismatch',
          msg: `${left.type()} ${operator} ${right.type()}`,
        });
      default:
        return this.newError({
          type: 'operator',
          msg: `${left.type()} ${operator} ${right.type()}`,
        });
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

  evalArrayIndexExpression(arr: Object, index: Object): Object {
    const { elements } = arr as obj.Array;
    const idx = (index as obj.Integer).value;
    const max = elements.length - 1;

    if (idx < 0 || idx > max) return NULL;

    return elements[idx];
  }

  evalHashIndexExpression(hash: Object, index: Object): Object {
    const { pairs } = hash as obj.Hash;

    if (!HASHKEY.hashable(index)) {
      return this.newError({ type: 'unusable', msg: `${index.type()}` });
    }

    const key = HASHKEY.hash(index);

    if (!pairs.get(key)) {
      return NULL;
    }

    return pairs.get(key).value;
  }

  evalIndexExpression(left: Object, index: Object): Object {
    switch (true) {
      case left.type() === ObjectType.ARRAY_OBJ &&
        index.type() === ObjectType.INTEGER_OBJ:
        return this.evalArrayIndexExpression(left, index);
      case left.type() === ObjectType.HASH_OBJ:
        return this.evalHashIndexExpression(left, index);
      default:
        return this.newError({
          type: 'undefined',
          msg: `index operator not supported: ${left.type()}`,
        });
    }
  }

  minusPrefixOperatorExpression(right: Object): Object {
    if (right.type() !== ObjectType.INTEGER_OBJ) {
      return this.newError({ type: 'operator', msg: `-${right.type()}` });
    }
    const value = (right as obj.Integer).value;
    return new obj.Integer(-value);
  }

  evalPrefixExpression(operator: string, right: Object): Object {
    switch (operator) {
      case TokenType.BANG:
        return this.bangOperatorExpression(right);
      case TokenType.MINUS:
        return this.minusPrefixOperatorExpression(right);
      default:
        return this.newError({
          type: 'operator',
          msg: `${operator} ${right.type()}`,
        });
    }
  }
}
