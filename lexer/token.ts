import TokenType from './tokenType';

type Token = {
  type: TokenType;
  literal: string;
};

const lookUpToken = (str: string) => {
  if (str === 'let') {
    return TokenType.LET;
  }

  if (str === 'fn') {
    return TokenType.FUNCTION;
  }

  return TokenType.IDENT;
};

export default Token;
export { lookUpToken };
