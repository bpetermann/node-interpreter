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

export { Token, lookUpToken };
