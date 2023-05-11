/**
 * Simple Parser: recursive descent implementation
 */

const {Tokenizer} = require('./Tokenizer');

class Parser {
    /**
     * Initializes the parser.
     */
    constructor() {
        this._tokenizer = new Tokenizer();
    }

    /**
     * Parses a string into an AST.
     */
    parse(string) {
        this._tokenizer.init(string);

        // Prime the tokenizer to obtain the first
        // token which is our lookahead.  The lookahead is
        // used for predictive parsing.

        this._lookahead = this._tokenizer.getNextToken();

        // Parse recursively starting from the main
        // entry point, the Program:
        return this.Program();
    }

    /**
     * Main entry point.
     *
     * Program
     *   : ExpressionStatement
     *   ;
     */
    Program() {
        return {
            type: 'program',
            body: this.ExpressionStatement()
        };
    }

    /**
     * ExpressionStatement
     *   : Expression ';'
     *   ;
     */
    ExpressionStatement() {
        const expression = this.Expression();
        return {
            type: 'expr',
            expression
        }
    }

    /**
     * Expression
     *   : OrExpression
     *   ;
     */
    Expression() {
        return this.OrExpression();
    }

    /**
     * OperandNode
     *   : operand
     *   | paren_expr
     *   ;
     */
    OperandNode() {
        switch (this._lookahead.type) {
            case 'operand': return this.Operand();
            case 'open_paren': return this.ParenthesizedExpression();
        }

        throw new SyntaxError(`OperandNode: unexpected operand type`);
    }

    /**
     * Parenthesized Expression
     * : '(' Expression ')'
     * ;
     */
    ParenthesizedExpression() {
        this._eat('open_paren');
        const expression = this.Expression();
        this._eat('close_paren');
        return expression;
    }

    /**
     * Boolean Expression
     *   : boolean_expr
     *   ;
     */
    _BooleanExpression(builderName, operatorToken) {
        let left = this[builderName]();

        while (this._lookahead && this._lookahead.type === operatorToken) {
            // Operator AND,OR
            const operator = this._eat(operatorToken);

            const right = this[builderName]();

            left = {
                type: 'boolean_expr',
                operator,
                left,
                right
            };

        }

        return left;
    }

    /**
     * Boolean AND Expression
     *   : boolean_expr
     *   ;
     */
    AndExpression() {
        return this._BooleanExpression(
            'OperandNode',
            'and_operator'
        );
    }

    /**
     * Boolean OR Expression
     *   : boolean_expr
     *   ;
     */
    OrExpression() {
        return this._BooleanExpression(
            'AndExpression',
            'or_operator'
        );
    }

    /**
     * Operand
     *   : operand
     *   ;
     */
    Operand() {
        const token = this._eat('operand');
        return {
            type: 'operand',
            value: token.value
        }
    }

    /**
     * Expects a token of given type.
     */
    _eat(tokenType) {
        const token = this._lookahead;

        if(token == null) {
            throw new SyntaxError(
                `Unexpected end of input, expected: ${tokenType}`
            );
        }

        if (token.type !== tokenType) {
            throw new SyntaxError(
                `Unexpected token: "${token.value}", expected: ${tokenType}`
            );
        }

        // Advance to next token.
        this._lookahead = this._tokenizer.getNextToken();

        return token;
    }

}

module.exports = {
    Parser,
}
