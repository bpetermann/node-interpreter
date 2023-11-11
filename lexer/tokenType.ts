enum TokenType {
  ILLEGAL = 'ILLEGAL',
  EOF = 'EOF',
  IDENT = 'IDENT',
  INT = 'INT',
  ASSIGN = '=',
  PLUS = '+',
  COMMA = ',',
  SEMICOLON = ';',
  LPAREN = '(',
  RPAREN = ')',
  LBRACE = '{',
  RBRACE = '}',
  FUNCTION = 'FUNCTION',
  LET = 'LET',
  BANG = '!',
  MINUS = '-',
  SLASH = '/',
  ASTERISK = '*',
  LT = '<',
  GT = '>',
}

enum WhiteSpace {
  WHITESPACE = ' ',
  TAB = '\t',
  NEWLINE = '\n',
  CARRIAGE_RETURN = '\r',
}

export { WhiteSpace };
export default TokenType;
