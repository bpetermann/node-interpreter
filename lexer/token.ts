import TokenType from './tokenType';

type Token = {
  type: TokenType;
  literal: string;
};

export default Token;
