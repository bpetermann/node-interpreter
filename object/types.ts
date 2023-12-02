interface Env {
  get: (name: string) => Object;
  set: (name: string, val: Object) => Object;
}

enum ObjectType {
  INTEGER_OBJ = 'INTEGER',
  BOOLEAN_OBJ = 'BOOLEAN',
  NULL_OBJ = 'NULL',
  RETURN_VALUE_OBJ = 'RETURN_VALUE',
  ERROR_OBJ = 'ERROR',
  FUNCTION_OBJ = 'FUNCTION',
  STRING_OBJ = 'STRING',
  BUILTIN_OBJ = 'BUILTIN',
  ARRAY_OBJ = 'ARRAY',
}

interface Object {
  type: () => ObjectType;
  inspect: () => string;
}

export { Env, ObjectType, Object };
