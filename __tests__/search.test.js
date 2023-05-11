const { SearchUtil } = require('../src/Search');

describe('SearchUtil', () => {
    let searchUtil;
    let data;

    beforeEach(() => {
        searchUtil = new SearchUtil();
        data = [
            {name: 'hello', age: 1},
            {name: 'world', age: 2},
            {name: 'goodbye', age: 3},
            {name: 'goodnight', age: 4}
        ];
    });

    test('generates correct filter for OR query', () => {
        const filter = searchUtil.generateFilter('hello OR world');
        const result = data.filter(filter);
        expect(result).toEqual([
            {name: 'hello', age: 1},
            {name: 'world', age: 2}
        ]);
    });

    test('generates correct filter for AND query', () => {
        const filter = searchUtil.generateFilter('hello AND world');
        const result = data.filter(filter);
        expect(result).toEqual([]);
    });

    test('generates correct filter for single operand', () => {
        const filter = searchUtil.generateFilter('hello');
        const result = data.filter(filter);
        expect(result).toEqual([
            {name: 'hello', age: 1}
        ]);
    });

    test('handles partial matches', () => {
        const filter = searchUtil.generateFilter('hel');
        const result = data.filter(filter);
        expect(result).toEqual([
            {name: 'hello', age: 1}
        ]);
    });
});
