const ILLEGAL = 'ILLEGAL' as const;
const EOF = 'EOF' as const;
const IDENT = 'IDENT' as const;
const INT = 'INT' as const;
const ASSIGN = '=' as const;
const PLUS = '+' as const;
const COMMA = ',' as const;
const SEMICOLON = ';' as const;
const LPAREN = '(' as const;
const RPAREN = ')' as const;
const LBRACE = '{' as const;
const RBRACE = '}' as const;
const FUNCTION = 'FUNCTION' as const;
const LET = 'LET' as const;

enum TokenType {
  ILLEGAL,
  EOF,
  IDENT,
  INT,
  ASSIGN,
  PLUS,
  COMMA,
  SEMICOLON,
  LPAREN,
  RPAREN,
  LBRACE,
  RBRACE,
  FUNCTION,
  LET,
}

type Token = {
  type: TokenType;
  literal: string;
};

class Lexer {
  private _tokens: Token[];
  position: number;
  readPosition: number;
  char: string | null;

  private static instance: Lexer;

  constructor(public input: string) {
    this.position = 0;
    this.readPosition = 0;
    this.char = null;
    this._tokens = [];
    this.readChar();
  }

  public static getInstance(input: string): Lexer {
    if (!Lexer.instance) {
      Lexer.instance = new Lexer(input);
    }

    return Lexer.instance;
  }

  public getTokens(): Token[] {
    return this._tokens;
  }

  readChar() {
    if (this.readPosition >= this.input.length) {
      this.char = null;
    } else {
      this.char = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
    this.nextToken();
  }

  nextToken() {
    switch (this.char) {
      case ASSIGN:
        this._tokens.push({ type: TokenType.ASSIGN, literal: this.char });
        break;
      case SEMICOLON:
        this._tokens.push({ type: TokenType.SEMICOLON, literal: this.char });
        break;
      case LPAREN:
        this._tokens.push({ type: TokenType.LPAREN, literal: this.char });
        break;
      case RPAREN:
        this._tokens.push({ type: TokenType.RPAREN, literal: this.char });
        break;
      case COMMA:
        this._tokens.push({ type: TokenType.COMMA, literal: this.char });
        break;
      case PLUS:
        this._tokens.push({ type: TokenType.PLUS, literal: this.char });
        break;
      case LBRACE:
        this._tokens.push({ type: TokenType.LBRACE, literal: this.char });
        break;
      case RBRACE:
        this._tokens.push({ type: TokenType.RBRACE, literal: this.char });
        break;
      default:
        this._tokens.push({ type: TokenType.EOF, literal: null });
        return;
    }

    this.readChar();
  }
}

export { Lexer, TokenType };
