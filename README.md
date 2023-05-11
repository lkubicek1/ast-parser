
# Simple Boolean Expression Parser

This project includes a simple recursive descent parser for boolean expressions. It's written in JavaScript and parses expressions like 'hello AND world'.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Usage](#usage)
4. [Project Structure](#project-structure)
5. [Contributing](#contributing)
6. [License](#license)

## Introduction

The purpose of this project is to practice and explore the theory of parsing and abstract syntax trees. The parser uses a recursive descent parsing algorithm and handles single-line boolean expressions.

## Getting Started

To use this project, you'll need to have Node.js installed on your computer. Once you've got that, you can clone the repository and install the dependencies:

```sh
git clone https://github.com/lkubicek1/ast-parser.git
cd yourrepository
npm install
```

## Usage

Here's a simple example of how to use the parser:

```javascript
const { Parser } = require('./Parser');

let parser = new Parser();
let ast = parser.parse('hello AND world');
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

## Project Structure

The main parts of the project are:

- `Tokenizer.js`: This file includes the `Tokenizer` class, which is responsible for breaking the input into tokens.

- `Parser.js`: This file includes the `Parser` class, which is responsible for parsing the tokens into an abstract syntax tree.

## Contributing

Contributions to this project are welcome. Please feel free to fork the repository and submit pull requests. If you find any issues, please report them on the GitHub issue tracker.

## License

This project is licensed under the Apache 2.0 License - see the `LICENSE.md` file for details.

