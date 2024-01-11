import { ErrorType, Token } from '../../types';

type ErrorProps = {
  type?: ErrorType;
  expected?: string;
  msg?: string;
  got: Token;
};

const setError = ({ type, expected, msg, got }: ErrorProps) => {
  switch (type) {
    case 'parse':
      return `no prefix parse function for "${got.literal}" found`;
    case 'debug':
      return msg;
    default:
      return `expected next token to be "${expected}" got "${got.literal}" instead`;
  }
};

export default setError;
