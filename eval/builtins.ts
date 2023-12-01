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
      return new ErrorObject(
        `wrong number of arguments. got=${args.length}, want=1`
      );
    }
    switch (true) {
      case args[0] instanceof StringObject:
        return new IntegerObject(args[0].value.length);
      default:
        return new ErrorObject(
          `argument to "len" not supporte, got ${args[0].type()}`
        );
    }
  }),

  toLower: new BuiltinObject((...args: any): Object => {
    if (args.length !== 1) {
      return new ErrorObject(
        `wrong number of arguments. got=${args.length}, want=1`
      );
    }
    switch (true) {
      case args[0] instanceof StringObject:
        return new StringObject(args[0].value.toLowerCase());
      default:
        return new ErrorObject(
          `argument to "toLower" not supporte, got ${args[0].type()}`
        );
    }
  }),

  toUpper: new BuiltinObject((...args: any): Object => {
    if (args.length !== 1) {
      return new ErrorObject(
        `wrong number of arguments. got=${args.length}, want=1`
      );
    }
    switch (true) {
      case args[0] instanceof StringObject:
        return new StringObject(args[0].value.toUpperCase());
      default:
        return new ErrorObject(
          `argument to "toLower" not supporte, got ${args[0].type()}`
        );
    }
  }),
};

export { builtins };
