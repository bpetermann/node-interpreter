import { Object, Env } from '../../types';

class Environment implements Env {
  private store: { [k: string]: Object };

  constructor(store: { [k: string]: Object }) {
    this.store = store;
  }

  get(name: string): Object {
    let value = this.store[name];

    return value;
  }

  set(name: string, val: Object): Object {
    this.store[name] = val;
    return val;
  }
}

class EnclosedEnvironment implements Env {
  private store: { [k: string]: Object };
  private outer: Environment;

  constructor(outer: Environment) {
    this.store = {};
    this.outer = outer;
  }

  get(name: string): Object {
    let value = this.store[name];

    if (!value) {
      value = this.outer.get(name);
    }

    return value;
  }

  set(name: string, val: Object): Object {
    this.store[name] = val;
    return val;
  }
}

export { Environment, EnclosedEnvironment };
