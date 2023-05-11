const { Parser } = require('../src/Parser');

describe('Parser', () => {
    let parser;

    beforeEach(() => {
        parser = new Parser();
    });

    test('should parse a single operand', () => {
        const ast = parser.parse('hello');
        expect(ast).toEqual({
            type: 'program',
            body: {
                type: 'expr',
                expression: {
                    type: 'operand',
                    value: 'hello'
                }
            }
        });
    });

    test('should parse an AND expression', () => {
        const ast = parser.parse('hello AND world');
        expect(ast).toEqual({
            type: 'program',
            body: {
                type: 'expr',
                expression: {
                    type: 'boolean_expr',
                    operator: {
                        type: 'and_operator',
                        value: 'AND'
                    },
                    left: {
                        type: 'operand',
                        value: 'hello'
                    },
                    right: {
                        type: 'operand',
                        value: 'world'
                    }
                }
            }
        });
    });

    test('should parse an OR expression', () => {
        const ast = parser.parse('hello OR world');
        expect(ast).toEqual({
            type: 'program',
            body: {
                type: 'expr',
                expression: {
                    type: 'boolean_expr',
                    operator: {
                        type: 'or_operator',
                        value: 'OR'
                    },
                    left: {
                        type: 'operand',
                        value: 'hello'
                    },
                    right: {
                        type: 'operand',
                        value: 'world'
                    }
                }
            }
        });
    });
});
