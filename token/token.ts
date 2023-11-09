type Token = {
  type:
    | typeof ILLEGAL
    | typeof EOF
    | typeof IDENT
    | typeof INT
    | typeof ASSIGN
    | typeof PLUS
    | typeof COMMA
    | typeof SEMICOLON
    | typeof LPAREN
    | typeof RPAREN
    | typeof LBRACE
    | typeof RBRACE
    | typeof FUNCTION
    | typeof LET;
  literal: string;
};

const ILLEGAL = 'ILLEGAL';
const EOF = 'EOF';

const IDENT = 'IDENT';
const INT = 'INT';

const ASSIGN = '=';
const PLUS = '+';

const COMMA = ',';
const SEMICOLON = ';';
const LPAREN = '(';
const RPAREN = ')';
const LBRACE = '{';
const RBRACE = '}';

const FUNCTION = 'FUNCTION';
const LET = 'LET';
