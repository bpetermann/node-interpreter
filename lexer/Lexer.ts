import TokenType from './tokenType';
import Token from './token';

export default class Lexer {
  private _input: string;
  private _tokens: Token[];
  private _position: number;
  private _readPosition: number;
  private _char: string | null;
  private static instance: Lexer;

  constructor() {
    this._position = 0;
    this._readPosition = 0;
    this._char = null;
    this._tokens = [];
  }

  public static getInstance(): Lexer {
    if (!Lexer.instance) {
      Lexer.instance = new Lexer();
    }

    return Lexer.instance;
  }

  public set input(input: string) {
    this._input = input;
  }

  public get tokens(): Token[] {
    return this._tokens;
  }

  readChar() {
    if (this._readPosition >= this._input.length) {
      this._char = null;
    } else {
      this._char = this._input[this._readPosition];
    }
    this._position = this._readPosition;
    this._readPosition += 1;
    this.nextToken();
  }

  nextToken() {
    switch (this._char) {
      case TokenType.ASSIGN:
        this._tokens.push({ type: TokenType.ASSIGN, literal: this._char });
        break;
      case TokenType.SEMICOLON:
        this._tokens.push({ type: TokenType.SEMICOLON, literal: this._char });
        break;
      case TokenType.LPAREN:
        this._tokens.push({ type: TokenType.LPAREN, literal: this._char });
        break;
      case TokenType.RPAREN:
        this._tokens.push({ type: TokenType.RPAREN, literal: this._char });
        break;
      case TokenType.COMMA:
        this._tokens.push({ type: TokenType.COMMA, literal: this._char });
        break;
      case TokenType.PLUS:
        this._tokens.push({ type: TokenType.PLUS, literal: this._char });
        break;
      case TokenType.LBRACE:
        this._tokens.push({ type: TokenType.LBRACE, literal: this._char });
        break;
      case TokenType.RBRACE:
        this._tokens.push({ type: TokenType.RBRACE, literal: this._char });
        break;
      default:
        this._tokens.push({ type: TokenType.EOF, literal: null });
        return;
    }

    this.readChar();
  }
}
