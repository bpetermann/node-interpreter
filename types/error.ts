export type ErrorType = {
  type:
    | 'operator'
    | 'mismatch'
    | 'function'
    | 'identifier'
    | 'support'
    | 'debug'
    | 'args'
    | 'expected'
    | 'parse'
    | 'unusable'
    | 'undefined'
    | 'debug';
  msg?: string;
  got?: string;
  expected?: string;
};
