/**
 * Tokenizer Spec: Regular Expression-Token Mapping
 *
 * The `Spec` array defines the tokenization rules for the Tokenizer class. It maps regular expressions
 * to corresponding token types. The order of the rules in the array determines the precedence of token matching.
 *
 * Each element in the `Spec` array is a two-element array:
 * - The first element is a regular expression that matches a token pattern.
 * - The second element is the token type associated with the matched pattern.
 *
 * The Spec defines various token patterns for different components of boolean expressions, including:
 * - Parentheses: '(' and ')'
 * - Boolean operators: 'AND' and 'OR'
 * - Compound operators: patterns with 'AND'/'OR' operators and operands
 * - Boolean operands: patterns with 'AND'/'OR' operators only
 * - Operands: other general token patterns, including any remaining characters
 *
 * The Tokenizer uses the `Spec` array to match and identify tokens in the input string during tokenization.
 * It iterates through the `Spec` array, attempting to match each regular expression against the remaining string.
 * The first matching pattern determines the token type, and the Tokenizer extracts the matched value as the token value.
 *
 * The `Spec` array is a critical component of the Tokenizer class and can be customized or extended to support
 * different tokenization requirements for specific grammars or languages.
 */
const Spec = [


    // -------------------------------------------------
    // Parenthesis:

    [/^\(/, 'open_paren'],
    [/^\)/, 'close_paren'],

    // -------------------------------------------------
    // Boolean Operators (OR,AND):
    [/^\sOR\s/i, 'or_operator'],
    [/^\sAND\s/i, 'and_operator'],

    // -------------------------------------------------
    // Compound Operators (AND):

    [/^(.*?)\sAND\s(.*?)\sOR\s/i, 'operand'],

    // -------------------------------------------------
    // Boolean Operands (OR,AND):
    [/^(.*?)\sOR\s/i, 'operand'],
    [/^(.*?)\sAND\s/i, 'operand'],

    [/(.*)/, 'operand']
];

/**
 * Tokenizer: Lexical Analysis for Boolean Expressions
 *
 * The Tokenizer class is responsible for performing lexical analysis (tokenization) of boolean expression strings.
 * It breaks down the input string into individual tokens based on a set of predefined rules defined in the Spec.
 *
 * The Tokenizer initializes with an input string and provides methods to iterate through the tokens:
 * - `hasMoreTokens()` checks if there are more tokens remaining.
 * - `getNextToken()` retrieves the next token from the input string.
 *
 * The Tokenizer uses a regular expression-based matching approach to identify the tokens based on the Spec.
 * The Spec is an array of regular expression-token type pairs that define the recognized token patterns.
 *
 * The Tokenizer supports various types of tokens, including parentheses, boolean operators ('AND'/'OR'),
 * compound operators, and operands. It skips whitespace and can handle different token ordering.
 *
 * This class implements a simple tokenization algorithm based on regular expressions and is designed
 * to be used as part of a larger parsing process, such as in a recursive descent parser.
 *
 * @class Tokenizer
 */
class Tokenizer {
    /**
     * Initializes the string.
     */
    init(string) {
        this._string = string;
        this._cursor = 0;
    }

    /**
     * Check if we still have more tokens.
     */
    hasMoreTokens() {
        return this._cursor < this._string.length;
    }

    /**
     * Obtains next token.
     */
    getNextToken() {
        if (!this.hasMoreTokens()) {
            return null;
        }

        const string = this._string.slice(this._cursor);

        for (const [regex, tokenType] of Spec) {
            const tokenValue = this._match(regex, string);

            // Couldn't match the rule, so continue.
            if (tokenValue == null) {
                continue;
            }

            // Should skip any null token specs
            if (tokenType == null) {
                return this.getNextToken();
            }

            return {
                type: tokenType,
                value: tokenValue
            };
        }

        throw new SyntaxError(`Unexpected token: "${string}"`);

    }

    /**
     * Matches a Token for a Regular Expression
     *
     * The `_match` function is a helper method used by the Tokenizer class to match a regular expression
     * against the remaining string and extract the corresponding token value. It is called for each regular
     * expression in the `Spec` array to find a match against the remaining portion of the input string.
     *
     * @param {RegExp} regex - The regular expression pattern to match against.
     * @param {string} string - The remaining portion of the input string to be matched.
     * @returns {string|null} - The matched token value if a match is found, or `null` if no match is found.
     *
     * The function performs the following steps:
     * 1. Uses the `exec` method of the regular expression to attempt a match against the input string.
     * 2. Checks if a match is found by examining the result of the `exec` method.
     * 3. If a match is found, extracts the matched value based on the result structure.
     * 4. Adjusts the token value (removes ')' if matched) and updates the cursor position.
     * 5. Returns the matched token value, trimmed and without ')' if present, or `null` if no match is found.
     *
     * The `_match` function is an internal helper method and is not meant to be called directly outside
     * the Tokenizer class. It is used to facilitate tokenization during the `getNextToken` method.
     */
    _match(regex, string) {
        const matched = regex.exec(string);

        if(matched == null) {
            return null;
        }

        const index = matched.length > 1 ? 1 : 0;

        if(!matched[index] || matched[index].length === 0) {
            return null;
        }

        let value = matched[index] === ')' ? matched[index] : matched[index].replace(')', '');
        this._cursor += value.length;
        return value.trim();
    }
}

module.exports = {
    Tokenizer,
};
