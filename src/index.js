// example usage
const { SearchUtil } = require("./Search");

const searchUtil = new SearchUtil();
const query = 'hel OR 3';
let filter = searchUtil.generateFilter(query);

let data = [
    {name: 'hello', age: 1},
    {name: 'world', age: 2},
    {name: 'goodbye', age: 3},
    {name: null, age: 6},
    {name: 'goodnight', age: 4}
];

let filteredData = data.filter(filter);
console.log(filteredData);  // Outputs: [ { name: 'hello' }, { name: 'world' } ]
