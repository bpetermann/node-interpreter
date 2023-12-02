interface NodeType {
  getString(): string;
  tokenLiteral(): string;
}

interface Statement extends NodeType {
  statementNode: () => void;
}

interface Expression extends NodeType {
  expressionNode: () => void;
}

enum ExpressionType {
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

export { NodeType, Statement, ExpressionType, Expression };
