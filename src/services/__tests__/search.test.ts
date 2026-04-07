import { SearchInterpreter } from '../SearchInterpreter';

describe('SearchInterpreter', () => {
    let interpreter: SearchInterpreter;
    let data: Array<{ name: string; age: number }>;

    beforeEach(() => {
        interpreter = new SearchInterpreter();
        data = [
            {name: 'hello', age: 1},
            {name: 'world', age: 2},
            {name: 'goodbye', age: 3},
            {name: 'goodnight', age: 4}
        ];
    });

    test('generates correct filter for OR query', () => {
        const filter = interpreter.compile('hello OR world');
        const result = data.filter(filter);
        expect(result).toEqual([
            {name: 'hello', age: 1},
            {name: 'world', age: 2}
        ]);
    });

    test('generates correct filter for AND query', () => {
        const filter = interpreter.compile('hello AND world');
        const result = data.filter(filter);
        expect(result).toEqual([]);
    });

    test('generates correct filter for single operand', () => {
        const filter = interpreter.compile('hello');
        const result = data.filter(filter);
        expect(result).toEqual([
            {name: 'hello', age: 1}
        ]);
    });

    test('handles partial matches', () => {
        const filter = interpreter.compile('hel');
        const result = data.filter(filter);
        expect(result).toEqual([
            {name: 'hello', age: 1}
        ]);
    });

    test('supports restricting the evaluated columns', () => {
        const filter = interpreter.compile('2', ['name']);
        const result = data.filter(filter);

        expect(result).toEqual([]);
    });
});
