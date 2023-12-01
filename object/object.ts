import { ObjectType, Object } from './types';
import { Statement, Identifier } from 'ast';
import { Env } from './environment';
import colors from 'colors';

class Integer implements Object {
  constructor(public value: number) {}

  type(): ObjectType {
    return ObjectType.INTEGER_OBJ;
  }

  inspect(): string {
    return colors.green(`${this.value}`);
  }
}

class Boolean implements Object {
  constructor(public value: boolean) {}

  type(): ObjectType {
    return ObjectType.BOOLEAN_OBJ;
  }

  inspect(): string {
    return colors.blue(`${this.value}`);
  }
}

class Null implements Object {
  type(): ObjectType {
    return ObjectType.NULL_OBJ;
  }

  inspect(): string {
    return colors.gray(`null`);
  }
}

class ReturnValue implements Object {
  constructor(public value: Object) {}

  type(): ObjectType {
    return ObjectType.RETURN_VALUE_OBJ;
  }

  inspect(): string {
    return this.value.inspect();
  }
}

class Error implements Object {
  message: string;
  constructor(
    public error: {
      type?: ErrorType;
      msg?: string;
      got?: string;
    }
  ) {
    switch (error.type) {
      case 'mismatch':
        this.message = `type mismatch: ${error.msg}`;
        break;
      case 'operator':
        this.message = `unknown operator: ${error.msg}`;
        break;
      case 'function':
        this.message = `not a function: ${error.msg}`;
        break;
      case 'identifier':
        this.message = `identifier not found: ${error.msg}`;
        break;
      case 'support':
        this.message = `argument to ${error.msg} not supported, got ${error.got}`;
        break;
      case 'args':
        this.message = `wrong number of arguments. got=${error.msg}, want=1`;
      default:
        this.message = error.msg;
    }
  }

  type(): ObjectType {
    return ObjectType.ERROR_OBJ;
  }

  inspect(): string {
    return colors.red(this.message);
  }
}

class Func implements Object {
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

class String implements Object {
  constructor(public value: string) {}

  type(): ObjectType {
    return ObjectType.STRING_OBJ;
  }

  inspect(): string {
    return colors.cyan(this.value);
  }
}

class Builtin implements Object {
  constructor(public fn: Function) {}

  type(): ObjectType {
    return ObjectType.BUILTIN_OBJ;
  }

  inspect(): string {
    return colors.magenta('builtin function');
  }
}

export { ReturnValue, Integer, Builtin, Boolean, Error, String, Func, Null };
