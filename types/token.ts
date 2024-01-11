export enum TokenType {
  ILLEGAL = 'ILLEGAL',
  EOF = 'EOF',
  // Identifiers + literals
  IDENT = 'IDENT',
  INT = 'INT',
  STRING = '"',
  // Delimiters
  COMMA = ',',
  SEMICOLON = ';',
  LPAREN = '(',
  RPAREN = ')',
  LBRACKET = '[',
  RBRACKET = ']',
  LBRACE = '{',
  RBRACE = '}',
  COLON = ':',
  // Keywords
  FUNCTION = 'FUNCTION',
  LET = 'LET',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  IF = 'IF',
  ELSE = 'ELSE',
  RETURN = 'RETURN',
  // Operators
  EQ = '==',
  NOT_EQ = '!=',
  ASSIGN = '=',
  PLUS = '+',
  BANG = '!',
  MINUS = '-',
  SLASH = '/',
  ASTERISK = '*',
  LT = '<',
  GT = '>',
}

export type Token = {
  type: TokenType;
  literal: string;
};

export enum WhiteSpace {
  WHITESPACE = ' ',
  TAB = '\t',
  NEWLINE = '\n',
  CARRIAGE_RETURN = '\r',
}
