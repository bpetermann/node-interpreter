interface NodeType {
  getString(): string;
  tokenLiteral(): string;
}

interface Statement extends NodeType {
  statementNode: () => void;
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
}


export { NodeType, Statement, ExpressionType };
