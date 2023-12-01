import {
  BuiltinObject,
  ErrorObject,
  IntegerObject,
  StringObject,
} from '../object';
import { Object } from '../object';

const builtins = {
  len: new BuiltinObject((...args: any): Object => {
    if (args.length !== 1) {
      return new ErrorObject({
        type: 'args',
        msg: args.length,
      });
    }
    switch (true) {
      case args[0] instanceof StringObject:
        return new IntegerObject(args[0].value.length);
      default:
        return new ErrorObject({
          type: 'support',
          msg: 'len',
          got: args[0].type(),
        });
    }
  }),

  toLower: new BuiltinObject((...args: any): Object => {
    if (args.length !== 1) {
      return new ErrorObject({ type: 'args', msg: args.length });
    }
    switch (true) {
      case args[0] instanceof StringObject:
        return new StringObject(args[0].value.toLowerCase());
      default:
        return new ErrorObject({
          type: 'support',
          msg: 'toLower',
          got: args[0].type(),
        });
    }
  }),

  toUpper: new BuiltinObject((...args: any): Object => {
    if (args.length !== 1) {
      return new ErrorObject({
        type: 'args',
        msg: args.length,
      });
    }
    switch (true) {
      case args[0] instanceof StringObject:
        return new StringObject(args[0].value.toUpperCase());
      default:
        return new ErrorObject({
          type: 'support',
          msg: 'toUpper',
          got: args[0].type(),
        });
    }
  }),
};

export { builtins };
