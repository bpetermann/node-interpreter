export interface NodeType {
  getString(): string;
  tokenLiteral(): string;
}

export interface Statement extends NodeType {
  statementNode: () => void;
}

export interface Expression extends NodeType {
  expressionNode: () => void;
}

export const enum ExpressionType {
  LOWEST,
  EQUALS,
  LESSGREATER,
  GREATER,
  SUM,
  PRODUCT,
  PREFIX,
  CALL,
  INDEX,
}
