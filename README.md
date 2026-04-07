# Simple Boolean Expression Parser and UI

This project includes a simple recursive descent parser for boolean expressions and a React UI that demonstrates the parser in action. You can enter expressions such as `hello AND world`, inspect the emitted tokens, view the generated abstract syntax tree (AST), and see the compiled filter applied to sample data.

## Features

- Lexical Analysis (Tokenization)
- Syntax Analysis (Parsing)
- AST generation
- Data filtering based on boolean expressions
- Interactive UI to visualize tokens and AST
- GitHub Pages deployment via Vite and `gh-pages`

## Getting Started

Install dependencies:

```shell
npm install
```

Start the development server:

```shell
npm run dev
```

Create a production build:

```shell
npm run build
```

Refresh the generated sample dataset:

```shell
npm run generate:data
```

Preview the built site locally:

```shell
npm run preview
```

Run the test suite once:

```shell
npm run test:run
```

GitHub Pages deploys automatically from the `main` branch through the included GitHub Actions workflow.

In the repository settings, set Pages to use the `GitHub Actions` source.

## Usage

### Parsing

Here's a simple example of how to use the parser:

```javascript
import { Parser } from './src/services/Parser';

const parser = new Parser();
const ast = parser.translate('hello AND world');
console.log(ast);
```

This will output the abstract syntax tree (AST) of the expression:

```json
{
  "type": "program",
  "body": {
    "type": "expr",
    "expression": {
      "type": "boolean_expr",
      "operator": {
        "type": "and_operator",
        "value": "AND"
      },
      "left": {
        "type": "operand",
        "value": "hello"
      },
      "right": {
        "type": "operand",
        "value": "world"
      }
    }
  }
}
```

### Data Filtering

```javascript
import { SearchInterpreter } from './src/services/SearchInterpreter';

const interpreter = new SearchInterpreter();
const data = [
  { name: 'hello', age: 1 },
  { name: 'world', age: 2 },
  { name: 'goodbye', age: 3 },
  { name: 'goodnight', age: 4 },
];

const filter = interpreter.compile('hello OR world');
const filteredData = data.filter(filter);
```

This will compile the input query to a filter function and execute the filter:

```javascript
[
  { name: 'hello', age: 1 },
  { name: 'world', age: 2 },
]
```

## Project Structure

The main parser and interpreter modules live in `src/services`:

- `Tokenizer.js`: This file includes the `Tokenizer` class, which is responsible for breaking the input into tokens.
- `Parser.js`: This file includes the `Parser` class, which is responsible for parsing the tokens into an abstract syntax tree.
- `SearchInterpreter.js`: This file includes the `SearchInterpreter` class, which is responsible for parsing an input query into an AST and interpreting the AST to generate a filter function.

## Testing

This project uses Vitest with Testing Library. Run `npm test` for watch mode or `npm run test:run` for a single CI-style pass.

## Demonstration UI

The React application provides an interactive interface for the parser. The user can input a boolean expression, which is parsed in real-time. The resulting tokens and AST are displayed side-by-side.

You can view a live demo of the application at [https://lkubicek1.github.io/ast-parser](https://lkubicek1.github.io/ast-parser)

## Contributing

Contributions to this project are welcome. Please feel free to fork the repository and submit pull requests. If you find any issues, please report them on the GitHub issue tracker.

## License

This project is licensed under the Apache 2.0 License - see the `LICENSE.md` file for details.

