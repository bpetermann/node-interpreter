enum TokenType {
  ILLEGAL = 'ILLEGAL',
  EOF = 'EOF',
  // Identifiers + literals
  IDENT = 'IDENT',
  INT = 'INT',
  // Delimiters
  COMMA = ',',
  SEMICOLON = ';',
  LPAREN = '(',
  RPAREN = ')',
  LBRACE = '{',
  RBRACE = '}',
  // Keywords
  FUNCTION = 'FUNCTION',
  LET = 'LET',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  IF = 'IF',
  ELSE = 'ELSE',
  RETURN = 'RETURN',
  // Operators
  ASSIGN = '=',
  PLUS = '+',
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
