import { Statement, ErrorType, Env, ObjectType, Object } from '../../types';
import { Identifier } from 'lib/ast';
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
  constructor(public error: ErrorType) {
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
        break;
      case 'unusable':
        this.message = `unusable as hash key: ${error.msg}`;
        break;
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

class Array implements Object {
  constructor(public elements: Object[]) {}

  type(): ObjectType {
    return ObjectType.ARRAY_OBJ;
  }

  inspect(): string {
    return colors.magenta(
      `[${this.elements.map((el) => el.inspect()).join(',')}]`
    );
  }
}

class HashKey {
  public hashable(input: Object): boolean {
    return (
      input.type() === ObjectType.BOOLEAN_OBJ ||
      input.type() === ObjectType.INTEGER_OBJ ||
      input.type() === ObjectType.STRING_OBJ
    );
  }

  public hash(input: Object): number {
    switch (input.type()) {
      case ObjectType.BOOLEAN_OBJ:
        return (input as Boolean).value ? 1 : 0;
      case ObjectType.INTEGER_OBJ:
        return (input as Integer).value;
      default:
        return this.stringToHash((input as String).value);
    }
  }

  private stringToHash(input: string): number {
    return input
      .split('')
      .reduce(
        (hash, char) => ((hash << (5 - hash)) + char.charCodeAt(0)) | hash,
        0
      );
  }
}

class HashPair implements Object {
  key: Object;
  value: Object;

  constructor(key: Object, value: Object) {
    this.key = key;
    this.value = value;
  }

  type(): ObjectType {
    return ObjectType.HASH_OBJ;
  }

  inspect(): string {
    return colors.green(`${this.key.inspect()}: ${this.value.inspect()}`);
  }
}

class Hash implements Object {
  pairs: Map<number, HashPair>;

  constructor(pairs: Map<number, HashPair>) {
    this.pairs = pairs;
  }

  type(): ObjectType {
    return ObjectType.HASH_OBJ;
  }

  inspect(): string {
    const keyValues: string[] = [];
    [...this.pairs].map(([_, value]) => keyValues.push(value.inspect()));
    return colors.magenta(`{${keyValues.join(', ')}}`);
  }
}

export {
  ReturnValue,
  Integer,
  Builtin,
  Boolean,
  Error,
  String,
  Func,
  Null,
  Array,
  Hash,
  HashKey,
  HashPair,
};
