const {Tokenizer} = require('./Tokenizer');

/**
 * Parser: Recursive Descent Implementation
 *
 * The Parser class is responsible for converting a boolean expression string into an
 * Abstract Syntax Tree (AST) using the recursive descent parsing technique.
 *
 * It performs lexical analysis (tokenization) using a Tokenizer, and then applies a recursive
 * descent parsing algorithm to construct the AST based on the grammar rules of the boolean expression.
 * The grammar is defined using a set of production rules that guide the parsing process.
 *
 * The Parser class provides the `translate` method to parse the input string and generate the AST.
 * The AST represents the structure of the boolean expression, with each node in the tree corresponding
 * to a construct (e.g., 'AND'/'OR' operation, operand) in the expression.
 *
 * The Parser class supports a simple grammar for boolean expressions with 'AND' and 'OR' operators,
 * as well as parentheses for grouping subexpressions.
 *
 * This class follows a top-down recursive descent approach, where each nonterminal symbol in the grammar
 * has a corresponding parsing method that recursively calls other parsing methods to construct the AST.
 *
 * @class Parser
 */
class Parser {
    /**
     * Initializes the parser.
     */
    constructor() {
        this._tokenizer = new Tokenizer();
    }

    /**
     * Translates a boolean expression string into an Abstract Syntax Tree (AST).
     *
     * This method uses a Tokenizer to tokenize the input string and then applies a recursive descent
     * parsing technique to construct the AST according to the following grammar:
     *
     * Program -> Expression
     * Expression -> OrExpression
     * OrExpression -> AndExpression ('OR' AndExpression)*
     * AndExpression -> Operand ('AND' Operand)*
     * Operand -> WORD | '(' Expression ')'
     *
     * The AST represents the structure of the boolean expression, with each node in the tree
     * corresponding to a construct (e.g., 'AND'/'OR' operation, operand) in the expression.
     *
     * @param {string} string - The boolean expression to be parsed into an AST.
     * @returns {Object} - The root node of the AST representing the boolean expression.
     */
    translate(string) {
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
     * Consumes and Validates the Next Token
     *
     * The `_eat` function is a helper method used by the Parser class to consume and validate the next token
     * from the Tokenizer. It checks if the next token matches the expected token type and returns the consumed token.
     * If the next token does not match the expected type, an error is thrown.
     *
     * @param {string} tokenType - The expected type of the next token.
     * @returns {Object} - The consumed token if it matches the expected type.
     * @throws {SyntaxError} - If the next token does not match the expected type.
     *
     * The function performs the following steps:
     * 1. Retrieves the next token from the Tokenizer using `this._lookahead`.
     * 2. Checks if the next token exists and is not `null`.
     * 3. Compares the type of the next token with the expected token type.
     * 4. If the types match, consumes the token by updating the `this._lookahead` with the next token.
     * 5. Returns the consumed token.
     * 6. If the types do not match, throws a `SyntaxError` with an appropriate error message.
     *
     * The `_eat` function is an internal helper method and is not meant to be called directly outside
     * the Parser class. It is used to facilitate the parsing process and ensure syntactic correctness.
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
