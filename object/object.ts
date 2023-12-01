import { ObjectType, Object } from './types';
import { Statement, Identifier } from 'ast';
import { Env } from './environment';
import colors from 'colors';

class IntegerObject implements Object {
  constructor(public value: number) {}

  type(): ObjectType {
    return ObjectType.INTEGER_OBJ;
  }

  inspect(): string {
    return colors.green(`${this.value}`);
  }
}

class BooleanObject implements Object {
  constructor(public value: boolean) {}

  type(): ObjectType {
    return ObjectType.BOOLEAN_OBJ;
  }

  inspect(): string {
    return colors.blue(`${this.value}`);
  }
}

class NullObject implements Object {
  type(): ObjectType {
    return ObjectType.NULL_OBJ;
  }

  inspect(): string {
    return colors.gray(`null`);
  }
}

class ReturnValueObject implements Object {
  constructor(public value: Object) {}

  type(): ObjectType {
    return ObjectType.RETURN_VALUE_OBJ;
  }

  inspect(): string {
    return this.value.inspect();
  }
}

class ErrorObject implements Object {
  constructor(public message: string) {}

  type(): ObjectType {
    return ObjectType.ERROR_OBJ;
  }

  inspect(): string {
    return colors.red(this.message);
  }
}

class FunctionObject implements Object {
  parameters: Identifier[];
  body: Statement;
  env: Env;

  constructor(parameters: Identifier[], env: Env, body: Statement) {
    this.parameters = parameters;
    this.env = env;
    this.body = body;
  }

  type(): ObjectType {
    return ObjectType.FUNCTION_OBJ;
  }

  inspect(): string {
    return (
      colors.magenta('fn(') +
      `${this.parameters.map((param) => param.getString()).join(', ')}` +
      colors.magenta('){') +
      `${this.body.getString()}` +
      colors.magenta('}')
    );
  }
}

class StringObject implements Object {
  constructor(public value: string) {}

  type(): ObjectType {
    return ObjectType.STRING_OBJ;
  }

  inspect(): string {
    return colors.cyan(this.value);
  }
}

class BuiltinObject implements Object {
  constructor(public fn: Function) {}

  type(): ObjectType {
    return ObjectType.BUILTIN_OBJ;
  }

  inspect(): string {
    return colors.magenta('builtin function');
  }
}

export {
  IntegerObject,
  BooleanObject,
  NullObject,
  ReturnValueObject,
  ErrorObject,
  FunctionObject,
  StringObject,
  BuiltinObject,
};
