import { WhiteSpace, TokenType, Token, lookUpToken } from '../token';

export default class Lexer {
  private _tokens: Token[];
  private _position: number;
  private _readPosition: number;
  private _char: string | null;

  constructor(public readonly input: string) {
    this._position = 0;
    this._readPosition = 0;
    this._char = null;
    this._tokens = [];
    this.start();
  }

  public start(): void {
    this.readChar();
    while (this._readPosition <= this.input.length) {
      this.nextToken();
    }
    this._tokens.push({ type: TokenType.EOF, literal: '' });
  }

  get tokens(): Token[] {
    return this._tokens;
  }

  private isLetter(char: string): boolean {
    return 'abcdefghijklmnopqrstuvwxyz_'.includes(char.toLowerCase());
  }

  private isDigit(char: string): boolean {
    return '0123456789'.includes(char);
  }

  private readIdentifier(): Token {
    let pos = this._position;
    while (this.isLetter(this.input[pos])) {
      pos += 1;
    }
    this._readPosition = pos;
    return {
      type: lookUpToken(this.input.slice(this._position, pos)),
      literal: this.input.slice(this._position, pos),
    };
  }

  private readDigit(): Token {
    let pos = this._position;
    while (this.isDigit(this.input[pos])) {
      pos += 1;
    }
    this._readPosition = pos;
    return {
      type: TokenType.INT,
      literal: this.input.slice(this._position, pos),
    };
  }

  private peekChar(): string {
    if (this._readPosition >= this.input.length) {
      return '';
    } else {
      return this.input[this._readPosition];
    }
  }

  private readChar(): void {
    this._char = this.input[this._readPosition];
    this._position = this._readPosition;
    this._readPosition += 1;
  }

  private nextToken(): void {
    switch (this._char) {
      case WhiteSpace.WHITESPACE:
      case WhiteSpace.TAB:
      case WhiteSpace.NEWLINE:
      case WhiteSpace.CARRIAGE_RETURN:
        break;
      case TokenType.SEMICOLON:
      case TokenType.LPAREN:
      case TokenType.RPAREN:
      case TokenType.COMMA:
      case TokenType.PLUS:
      case TokenType.LBRACE:
      case TokenType.RBRACE:
      case TokenType.MINUS:
      case TokenType.SLASH:
      case TokenType.ASTERISK:
      case TokenType.LT:
      case TokenType.GT:
        this._tokens.push({
          type: this._char as TokenType,
          literal: this._char,
        });
        break;
      case TokenType.ASSIGN:
      case TokenType.BANG:
        const peekedEqualSign = this.peekChar() === '=';
        this._tokens.push({
          type: peekedEqualSign
            ? this._char === '='
              ? TokenType.EQ
              : TokenType.NOT_EQ
            : (this._char as TokenType),
          literal: peekedEqualSign ? `${this._char}=` : this._char,
        });
        if (peekedEqualSign) this.readChar();
        break;
      default:
        if (this.isLetter(this._char)) {
          this._tokens.push(this.readIdentifier());
        } else if (this.isDigit(this._char)) {
          this._tokens.push(this.readDigit());
        } else {
          this._tokens.push({
            type: TokenType.ILLEGAL,
            literal: TokenType.ILLEGAL,
          });
        }
        break;
    }
    this.readChar();
  }
}
