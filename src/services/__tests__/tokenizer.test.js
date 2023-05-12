import { Tokenizer } from '../Tokenizer';

describe('Tokenizer', () => {
    let tokenizer;

    beforeEach(() => {
        tokenizer = new Tokenizer();
    });

    it('should tokenize a simple boolean expression', () => {
        const input = 'hello OR world';
        const expectedTokens = [
            { type: 'operand', value: 'hello' },
            { type: 'or_operator', value: 'OR' },
            { type: 'operand', value: 'world' },
        ];

        const tokens = tokenizer.tokenize(input);

        expect(tokens).toEqual(expectedTokens);
    });

    it('should tokenize a boolean expression with compound operators', () => {
        const input = 'foo AND bar OR baz';
        const expectedTokens = [
            { type: 'operand', value: 'foo' },
            { type: 'and_operator', value: 'AND' },
            { type: 'operand', value: 'bar' },
            { type: 'or_operator', value: 'OR' },
            { type: 'operand', value: 'baz' },
        ];

        const tokens = tokenizer.tokenize(input);

        expect(tokens).toEqual(expectedTokens);
    });

    it('should tokenize a boolean expression with parentheses', () => {
        const input = '(hello AND world) OR foo';
        const expectedTokens = [
            { type: 'open_paren', value: '(' },
            { type: 'operand', value: 'hello' },
            { type: 'and_operator', value: 'AND' },
            { type: 'operand', value: 'world' },
            { type: 'close_paren', value: ')' },
            { type: 'or_operator', value: 'OR' },
            { type: 'operand', value: 'foo' },
        ];

        const tokens = tokenizer.tokenize(input);

        expect(tokens).toEqual(expectedTokens);
    });

    it('should tokenize a boolean expression with whitespace', () => {
        const input = '   hello    AND   world  ';
        const expectedTokens = [
            { type: 'operand', value: 'hello' },
            { type: 'and_operator', value: 'AND' },
            { type: 'operand', value: 'world' },
        ];

        const tokens = tokenizer.tokenize(input);

        expect(tokens).toEqual(expectedTokens);
    });

    // Add more test cases as needed

});
