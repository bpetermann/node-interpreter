import { ExpressionType } from '../ast';
import { TokenType } from '../token';

const precedences = (type: TokenType): number => {
  return (
    {
      [TokenType.EQ]: ExpressionType.EQUALS,
      [TokenType.NOT_EQ]: ExpressionType.EQUALS,
      [TokenType.LT]: ExpressionType.LESSGREATER,
      [TokenType.GT]: ExpressionType.LESSGREATER,
      [TokenType.PLUS]: ExpressionType.SUM,
      [TokenType.MINUS]: ExpressionType.SUM,
      [TokenType.SLASH]: ExpressionType.PRODUCT,
      [TokenType.ASTERISK]: ExpressionType.PRODUCT,
      [TokenType.LPAREN]: ExpressionType.CALL,
    }[type] || ExpressionType.LOWEST
  );
};

export { precedences };