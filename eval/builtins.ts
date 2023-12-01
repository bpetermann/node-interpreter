import * as obj from '../object';

const builtins = {
  len: new obj.Builtin((...args: any): obj.Object => {
    if (args.length !== 1) {
      return new obj.Error({
        type: 'args',
        msg: args.length,
      });
    }
    if (!(args[0] instanceof obj.String)) {
      return new obj.Error({
        type: 'support',
        msg: 'len',
        got: args[0].type(),
      });
    }

    return new obj.Integer(args[0].value.length);
  }),

  toLower: new obj.Builtin((...args: any): obj.Object => {
    if (args.length !== 1) {
      return new obj.Error({ type: 'args', msg: args.length });
    }
    if (!(args[0] instanceof obj.String)) {
      return new obj.Error({
        type: 'support',
        msg: 'toLower',
        got: args[0].type(),
      });
    }

    return new obj.String(args[0].value.toLowerCase());
  }),

  toUpper: new obj.Builtin((...args: any): obj.Object => {
    if (args.length !== 1) {
      return new obj.Error({
        type: 'args',
        msg: args.length,
      });
    }

    if (!(args[0] instanceof obj.String)) {
      return new obj.Error({
        type: 'support',
        msg: 'toUpper',
        got: args[0].type(),
      });
    }

    return new obj.String(args[0].value.toUpperCase());
  }),
};

export { builtins };
