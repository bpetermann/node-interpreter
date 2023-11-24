enum ObjectType {
  INTEGER_OBJ = 'INTEGER',
  BOOLEAN_OBJ = 'BOOLEAN',
  NULL_OBJ = 'NULL',
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

export { Object, IntegerObject, BooleanObject, NullObject };
