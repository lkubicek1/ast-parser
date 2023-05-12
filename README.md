# Simple Boolean Expression Parser and UI

This project includes a simple recursive descent parser for boolean expressions, and a React-based user interface to demonstrate the parser in action. The parser is written in JavaScript and parses expressions like 'hello AND world', and the user interface allows you to enter boolean expressions, see the resulting tokens and view the generated abstract syntax tree (AST).

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Usage](#usage)
5. [Demonstration UI](#demonstration-ui)
6. [Project Structure](#project-structure)
7. [Contributing](#contributing)
8. [License](#license)

## Introduction

The purpose of this project is to research and explore the theory of parsing, abstract syntax trees and compiler theory. The parser uses a recursive descent parsing algorithm and handles single-line boolean expressions. The user interface is built with React and Material-UI, and visualizes the parsing process in a user-friendly way.

## Features

- Lexical Analysis (Tokenization)
- Syntax Analysis (Parsing)
- AST generation
- Data filtering based on boolean expressions
- Interactive UI to visualize tokens and AST

## Getting Started

To use this project, you'll need to have Node.js and npm installed on your computer. Once you've got that, you can clone the repository and install the dependencies:

```shell
git clone https://github.com/lkubicek1/ast-parser.git
cd ast-parser
npm install
```

## Usage

To start the React app, use the start script:
```shell
npm start
```

### Parsing

Here's a simple example of how to use the parser:

```javascript
const { Parser } = require('./Parser');

let parser = new Parser();
let ast = parser.translate('hello AND world');
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
const { SearchInterpreter } = require('./SearchUtil');
const interpreter = new SearchInterpreter();
const data = [
    {"name": 'hello', "age": 1},
    {"name": 'world', "age": 2},
    {"name": 'goodbye', "age": 3},
    {"name": 'goodnight', "age": 4}
];
const filter = interpreter.compile('hello OR world');
const filteredData = data.filter(filter);
```

This will compile the input query to a filter function and execute the filter:

```javascript
[
    {"name": 'hello', "age": 1},
    {"name": 'world', "age": 2}
]
```

## Project Structure

The main parts of the project are found in the ```src/services``` directory:

- `Tokenizer.js`: This file includes the `Tokenizer` class, which is responsible for breaking the input into tokens.

- `Parser.js`: This file includes the `Parser` class, which is responsible for parsing the tokens into an abstract syntax tree.

- `SearchInterpreter.js`: This file includes the `SearchInterpreter` class, which is responsible for parsing an input query into an AST and interpreting the AST to generate a filter function.

## Testing

This project uses Jest for testing. Run npm test to execute the test suite.

## Demonstration UI

The React application provides an interactive interface for the parser. The user can input a boolean expression, which is parsed in real-time. The resulting tokens and AST are displayed side-by-side.

You can view a live demo of the application at [https://lkubicek1.github.io/ast-parser](https://lkubicek1.github.io/ast-parser)

## Contributing

Contributions to this project are welcome. Please feel free to fork the repository and submit pull requests. If you find any issues, please report them on the GitHub issue tracker.

## License

This project is licensed under the Apache 2.0 License - see the `LICENSE.md` file for details.

