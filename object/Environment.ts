import { Object } from './index';

class Environment {
  private _store: { [k: string]: Object };

  constructor(store: { [k: string]: Object }) {
    this._store = store;
  }

  get(name: string): Object {
    return this._store[name];
  }

  set(name: string, val: Object): Object {
    this._store[name] = val;
    return val;
  }
}

export { Environment };
