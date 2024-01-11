import { WhiteSpace, TokenType, Token } from '../../types';
import { lookUpToken } from '../token';

export default class Lexer {
  private _tokens: Token[];
  private position: number;
  private readPosition: number;
  private char: string | null;

  constructor(public readonly input: string) {
    this._tokens = [];
    this.position = 0;
    this.readPosition = 0;
    this.char = null;
    this.start();
  }

  public start(): void {
    this.readChar();
    while (this.readPosition <= this.input.length) {
      this.nextToken();
    }
    this._tokens.push({ type: TokenType.EOF, literal: '' });
  }

  get tokens(): Token[] {
    return this._tokens;
  }

  private isLetter(char: string): boolean {
    return char
      ? 'abcdefghijklmnopqrstuvwxyz_'.includes(char.toLowerCase())
      : false;
  }

  private isDigit(char: string): boolean {
    return '0123456789'.includes(char);
  }

  private readIdentifier(): Token {
    let pos = this.position;
    while (this.isLetter(this.input[pos])) {
      pos += 1;
    }
    this.readPosition = pos;
    return {
      type: lookUpToken(this.input.slice(this.position, pos)),
      literal: this.input.slice(this.position, pos),
    };
  }

  private readDigit(): Token {
    let pos = this.position;
    while (this.isDigit(this.input[pos])) {
      pos += 1;
    }
    this.readPosition = pos;
    return {
      type: TokenType.INT,
      literal: this.input.slice(this.position, pos),
    };
  }

  private readEqual(): void {
    const peekedEqualSign = this.peekChar() === '=';

    this._tokens.push({
      type: peekedEqualSign
        ? this.char === '='
          ? TokenType.EQ
          : TokenType.NOT_EQ
        : (this.char as TokenType),
      literal: peekedEqualSign ? `${this.char}=` : this.char,
    });

    if (peekedEqualSign) this.readChar();
  }

  private readString(): string {
    let pos = this.readPosition;

    while (this.input[pos] !== TokenType.STRING && pos < this.input.length) {
      pos += 1;
    }

    this.readPosition = pos + 1;

    return this.input.slice(this.position + 1, pos);
  }

  private peekChar(): string {
    if (this.readPosition >= this.input.length) {
      return '';
    } else {
      return this.input[this.readPosition];
    }
  }

  private readChar(): void {
    this.char = this.input[this.readPosition];
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  private nextToken(): void {
    switch (this.char) {
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
      case TokenType.LBRACKET:
      case TokenType.RBRACKET:
      case TokenType.LT:
      case TokenType.GT:
      case TokenType.COLON:
        this._tokens.push({
          type: this.char as TokenType,
          literal: this.char,
        });
        break;
      case TokenType.ASSIGN:
      case TokenType.BANG:
        this.readEqual();
        break;
      case TokenType.STRING:
        this._tokens.push({
          type: TokenType.STRING,
          literal: this.readString(),
        });
        break;
      default:
        if (this.isLetter(this.char)) {
          this._tokens.push(this.readIdentifier());
        } else if (this.isDigit(this.char)) {
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
