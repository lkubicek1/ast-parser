const { Tokenizer } = require('../src/Tokenizer');

describe('Tokenizer', () => {
    let tokenizer;

    beforeEach(() => {
        tokenizer = new Tokenizer();
    });

    it('should tokenize a single operand', () => {
        tokenizer.init('hello');
        expect(tokenizer.getNextToken()).toEqual({ type: 'operand', value: 'hello' });
        expect(tokenizer.hasMoreTokens()).toBe(false);
    });

    it('should tokenize an AND expression', () => {
        tokenizer.init('hello AND world');
        expect(tokenizer.getNextToken()).toEqual({ type: 'operand', value: 'hello' });
        expect(tokenizer.getNextToken()).toEqual({ type: 'and_operator', value: 'AND' });
        expect(tokenizer.getNextToken()).toEqual({ type: 'operand', value: 'world' });
        expect(tokenizer.hasMoreTokens()).toBe(false);
    });

    it('should tokenize an OR expression', () => {
        tokenizer.init('hello OR world');
        expect(tokenizer.getNextToken()).toEqual({ type: 'operand', value: 'hello' });
        expect(tokenizer.getNextToken()).toEqual({ type: 'or_operator', value: 'OR' });
        expect(tokenizer.getNextToken()).toEqual({ type: 'operand', value: 'world' });
        expect(tokenizer.hasMoreTokens()).toBe(false);
    });
});
