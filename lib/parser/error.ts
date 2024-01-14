import { ErrorType } from '../../types';

const setError = (err: ErrorType) => {
  switch (err.type) {
    case 'parse':
      return `no prefix parse function for "${err.got}" found`;
    case 'debug':
      return err.msg;
    default:
      return `expected next token to be "${err.expected}" got "${err.got}" instead`;
  }
};

export default setError;
