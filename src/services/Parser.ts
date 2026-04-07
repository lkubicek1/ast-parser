import { Tokenizer, type Token, type TokenType } from './Tokenizer';

export interface OperandNode {
  type: 'operand';
  value: string;
}

export type OperatorToken = Extract<Token, { type: 'and_operator' | 'or_operator' }>;

export interface BooleanExpressionNode {
  type: 'boolean_expr';
  operator: OperatorToken;
  left: ExpressionNode;
  right: ExpressionNode;
}

export type ExpressionNode = OperandNode | BooleanExpressionNode;

export interface ExpressionStatementNode {
  type: 'expr';
  expression: ExpressionNode;
}

export interface ProgramNode {
  type: 'program';
  body: ExpressionStatementNode;
}

export type AstNode = ProgramNode | ExpressionStatementNode | ExpressionNode;

type OperatorTokenType = OperatorToken['type'];

export class Parser {
  private _tokenizer = new Tokenizer();
  private _tokens: Token[] = [];
  private _lookahead: Token | null = null;

  translate(string: string): ProgramNode {
    this._tokens = this._tokenizer.tokenize(string);
    this._lookahead = this._getNextToken();

    const program = this.Program();

    if (this._lookahead != null) {
      throw new SyntaxError(`Unexpected token: "${this._lookahead.value}"`);
    }

    return program;
  }

  Program(): ProgramNode {
    return {
      type: 'program',
      body: this.ExpressionStatement(),
    };
  }

  ExpressionStatement(): ExpressionStatementNode {
    const expression = this.Expression();

    return {
      type: 'expr',
      expression,
    };
  }

  Expression(): ExpressionNode {
    return this.OrExpression();
  }

  OperandNode(): ExpressionNode {
    if (this._lookahead == null) {
      throw new SyntaxError('Unexpected end of input, expected operand');
    }

    switch (this._lookahead.type) {
      case 'operand':
        return this.Operand();
      case 'open_paren':
        return this.ParenthesizedExpression();
      default:
        throw new SyntaxError('OperandNode: unexpected operand type');
    }
  }

  ParenthesizedExpression(): ExpressionNode {
    this._eat('open_paren');
    const expression = this.Expression();
    this._eat('close_paren');
    return expression;
  }

  private _BooleanExpression(builder: () => ExpressionNode, operatorToken: OperatorTokenType): ExpressionNode {
    let left = builder();

    while (this._lookahead?.type === operatorToken) {
      const operator = this._eat(operatorToken);
      const right = builder();

      left = {
        type: 'boolean_expr',
        operator,
        left,
        right,
      };
    }

    return left;
  }

  AndExpression(): ExpressionNode {
    return this._BooleanExpression(() => this.OperandNode(), 'and_operator');
  }

  OrExpression(): ExpressionNode {
    return this._BooleanExpression(() => this.AndExpression(), 'or_operator');
  }

  Operand(): OperandNode {
    const token = this._eat('operand');

    return {
      type: 'operand',
      value: token.value,
    };
  }

  private _eat<T extends TokenType>(tokenType: T): Extract<Token, { type: T }> {
    const token = this._lookahead;

    if (token == null) {
      throw new SyntaxError(`Unexpected end of input, expected: ${tokenType}`);
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(`Unexpected token: "${token.value}", expected: ${tokenType}`);
    }

    this._lookahead = this._getNextToken();

    return token as Extract<Token, { type: T }>;
  }

  private _getNextToken(): Token | null {
    return this._tokens.shift() ?? null;
  }
}
