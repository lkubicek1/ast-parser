
const {Parser} = require('./Parser');

class SearchUtil {

    constructor() {
        this._parser = new Parser();
    }

    generateFilter(query) {
        const ast = this._parser.parse(query);
        return this._dig(ast);
    }

    _dig(ast) {
        if (ast.type === 'program') {
            return this._dig(ast.body.expression);
        } else if (ast.type === 'expr') {
            return this._dig(ast.expression);
        } else if (ast.type === 'boolean_expr') {
            const leftFilter = this._dig(ast.left);
            const rightFilter = this._dig(ast.right);
            if (ast.operator.value.toUpperCase() === 'AND') {
                return obj => leftFilter(obj) && rightFilter(obj);
            } else if (ast.operator.value.toUpperCase() === 'OR') {
                return obj => leftFilter(obj) || rightFilter(obj);
            } else {
                throw new Error(`Unknown operator: ${ast.operator.value}`);
            }
        } else if (ast.type === 'operand') {
            return obj => Object.values(obj).some(val => val !== null && val !== undefined && val.toString().includes(ast.value));
        } else {
            throw new Error(`Unknown node type: ${ast.type}`);
        }
    }
}


module.exports = {
    SearchUtil,
}
