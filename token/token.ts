import { TokenType } from './tokenType';

type Token = {
  type: TokenType;
  literal: string;
};

const lookUpToken = (str: string) => {
  return (
    {
      let: TokenType.LET,
      fn: TokenType.FUNCTION,
      true: TokenType.TRUE,
      false: TokenType.FALSE,
      if: TokenType.IF,
      else: TokenType.ELSE,
      return: TokenType.RETURN,
    }[str] || TokenType.IDENT
  );
};

const isTokenType = (
  token: Token,
  tokenType: TokenType
): token is Token & { type: typeof tokenType } => {
  return token.type === tokenType;
};

export { Token, lookUpToken, isTokenType };
