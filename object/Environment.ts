import { Object } from './index';

class Environment {
  private _store: { [k: string]: Object };

  constructor(store: { [k: string]: Object }) {
    this._store = store;
  }

  get(name: string): Object {
    let value = this._store[name];

    return value;
  }

  set(name: string, val: Object): Object {
    this._store[name] = val;
    return val;
  }
}

class EnclosedEnvironment {
  private _store: { [k: string]: Object };
  private _outer: Environment;

  constructor(outer: Environment) {
    this._store = {};
    this._outer = outer;
  }

  get(name: string): Object {
    let value = this._store[name];

    if (!value) {
      value = this._outer.get(name);
    }

    return value;
  }

  set(name: string, val: Object): Object {
    this._store[name] = val;
    return val;
  }
}

export { Environment, EnclosedEnvironment };
