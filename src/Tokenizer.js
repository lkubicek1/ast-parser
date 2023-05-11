/**
 * Tokenizer spec.
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
 * Tokenizer class.
 * Lazily pulls a token from a stream.
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

        for (const [regexp, tokenType] of Spec) {
            const tokenValue = this._match(regexp, string);

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
     * Matches a token for a regular expression.
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
