import colors from 'colors';

enum ObjectType {
  INTEGER_OBJ = 'INTEGER',
  BOOLEAN_OBJ = 'BOOLEAN',
  NULL_OBJ = 'NULL',
  RETURN_VALUE_OBJ = 'RETURN_VALUE',
  ERROR_OBJ = 'ERROR',
}

interface Object {
  type: () => ObjectType;
  inspect: () => string;
}

class IntegerObject implements Object {
  constructor(public value: number) {}

  type(): ObjectType {
    return ObjectType.INTEGER_OBJ;
  }

  inspect(): string {
    return `${this.value}`;
  }
}

class BooleanObject implements Object {
  constructor(public value: boolean) {}

  type(): ObjectType {
    return ObjectType.BOOLEAN_OBJ;
  }

  inspect(): string {
    return `${this.value}`;
  }
}

class NullObject implements Object {
  type(): ObjectType {
    return ObjectType.NULL_OBJ;
  }

  inspect(): string {
    return `null`;
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

export {
  Object,
  ObjectType,
  IntegerObject,
  BooleanObject,
  NullObject,
  ReturnValueObject,
  ErrorObject,
};
