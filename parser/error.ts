import { Token } from '../token';

type ErrorType = 'expected' | 'parse';

type ErrorProps = {
  type?: ErrorType;
  expected?: string;
  got: Token;
};

const setError = ({ type, expected, got }: ErrorProps) => {
  switch (type) {
    case 'parse':
      return `no prefix parse function for "${got.literal}" found`;
    default:
      return `expected next token to be "${expected}" got "${got.literal}" instead`;
  }
};

export default setError;
