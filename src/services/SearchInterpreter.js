import {Parser} from './Parser';

/**
 * SearchInterpreter: Boolean Expression Interpreter
 *
 * The SearchInterpreter class is responsible for interpreting boolean expressions and generating
 * filter functions that can be used to filter an array of objects based on the boolean expressions.
 *
 * The class provides a `generateFilter` method that takes a boolean expression as input and
 * translates it into a filter function. The filter function can be applied to an array of objects
 * to selectively include or exclude objects based on the boolean expression.
 *
 * The SearchInterpreter uses a Parser to parse the boolean expression into an Abstract Syntax Tree (AST).
 * It then traverses the AST and constructs the filter function based on the AST nodes and their types.
 * The filter function evaluates the boolean expression for each object in the array and determines
 * whether to include or exclude the object based on the expression's evaluation.
 *
 * This class provides a convenient way to interpret and apply boolean expressions for filtering data.
 * It can be used in scenarios where dynamic filtering based on boolean conditions is required.
 *
 * @class SearchInterpreter
 */
export class SearchInterpreter {

    constructor() {
        this._parser = new Parser();
    }

    /**
     * Parses the provided boolean expression string into an Abstract Syntax Tree (AST) using a Parser,
     * then compiles this AST into a filter function that can be used with JavaScript's Array filter method.
     *
     * This filter function will return `true` for any object that matches the boolean expression
     * (i.e., where the expression evaluates to `true`), and `false` otherwise. The boolean expression
     * can include 'AND'/'OR' operators and parentheses for grouping. The operands in the expression
     * are expected to be string values that are matched against the properties' values of the objects in the array.
     *
     * @param {string} query - The boolean expression to be parsed and compiled into a filter function.
     * @param {Array} COLUMNS - An optional array of columns to process for each object filter
     * @returns {Function} - A function that can be used as a filter function on an array of objects.
     */
    compile(query, COLUMNS = []) {
        const ast = this._parser.translate(query);
        return this._dig(ast, COLUMNS);
    }

    /**
     * Recursively traverses (or "digs" into) the AST (Abstract Syntax Tree) and translates it into a
     * filter function for JavaScript objects. This filter function can be used with Array's filter
     * method to filter an array of objects based on the parsed boolean expression.
     *
     * For each node in the AST, the method:
     * - Checks the type of the node
     * - Based on the type, it performs different operations:
     *   - If it's a 'program' or 'expr' type, it simply digs deeper into the tree.
     *   - If it's a 'boolean_expr', it constructs a function that performs the corresponding AND/OR operation.
     *   - If it's an 'operand', it constructs a function that checks if any property of an object matches the operand.
     *
     * @param {Object} ast - The Abstract Syntax Tree to be traversed.
     * @param {Array} COLUMNS - An optional array of columns to process for each object filter
     * @returns {Function} - A function that can be used as a filter function on an array of objects.
     */
    _dig(ast, COLUMNS) {
        if (ast.type === 'program') {
            return this._dig(ast.body.expression, COLUMNS);
        } else if (ast.type === 'expr') {
            return this._dig(ast.expression, COLUMNS);
        } else if (ast.type === 'boolean_expr') {
            const leftFilter = this._dig(ast.left, COLUMNS);
            const rightFilter = this._dig(ast.right, COLUMNS);
            if (ast.operator.value.toUpperCase() === 'AND') {
                return obj => leftFilter(obj) && rightFilter(obj);
            } else if (ast.operator.value.toUpperCase() === 'OR') {
                return obj => leftFilter(obj) || rightFilter(obj);
            } else {
                throw new Error(`Unknown operator: ${ast.operator.value}`);
            }
        } else if (ast.type === 'operand') {
            return obj => Object.entries(obj)
                .filter(([k]) => {
                    return COLUMNS.includes(k);
                })
                .map(([,v]) => v)
                .filter(v => v !== null && v !== undefined)
                .map(v => String(v).toLowerCase())
                .some(v => {
                    return v.includes(String(ast.value).toLowerCase());
                });
        } else {
            throw new Error(`Unknown node type: ${ast.type}`);
        }
    }
}
