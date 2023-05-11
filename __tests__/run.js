/**
 * Main test runner
 */

const {Parser} = require('../src/Parser');

const parser = new Parser();

const program = `1 AND (3 OR 4)`;

const ast = parser.parse(program);

console.log(JSON.stringify(ast, null, 2));
