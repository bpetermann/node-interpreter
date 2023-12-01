export {};

declare global {
  type ErrorType =
    | 'operator'
    | 'mismatch'
    | 'function'
    | 'identifier'
    | 'support'
    | 'debug'
    | 'args'
    | 'expected'
    | 'parse'
    | 'debug';
}
