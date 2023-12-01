# Node Interpreter

A Node/Typescript implementation of an interpreter, drawing inspiration from the excellent book ["Writing An Interpreter In Go"](https://interpreterbook.com/)

## Installation

To get started, clone the repository:

```bash
git clone https://github.com/bpetermann/node-interpreter.git
cd node-interpreter
```

Then, install dependencies and build the project:

```js
npm run fresh // Installs dependencies and builds the project
```

Finally, start the REPL (Read-Eval-Print Loop):

```js
npm run start // Starts the REPL
```

## Interpreter Workflow

1. Lexical Analysis (Lexer):

- The input code undergoes tokenization by the Lexer, breaking it into smaller units known as tokens (keywords, identifiers, operators).

2. Parsing:

- Tokens are organized into an abstract syntax tree (AST) by the Parser, following the grammar rules specific to the language.
- The AST represents the hierarchical structure of the code, arranging statements and expressions.

3. Evaluation:

- The interpreter traverses the AST, evaluating nodes and executing code based on the languages syntax rules.

This interpreter employs a process of lexical analysis, parsing, and evaluation to systematically analyze and execute code, creating an AST to interpret programs according to the specific syntax and rules of the language.

## Syntax Overview

The programming language syntax includes various delimiters, keywords, and operators:

Operators

- '=='
- '!='
- '='
- '+'
- '-'
- '/'
- '\*'
- '<'
- '>'

Keywords

- if
- fn
- let
- else
- true
- false
- return

## Usage Example

Here's a basic example illustrating the declaration and invocation of a function:

```js
>> let a = 2; // Declare a variable
>> let multiply = fn(x, y) { x * y }; // Declare a function
>> multiply(50 / 2, a); // Call the function
50
```

Example of closures:

```js
>> let newAdd = fn(x) {
  fn(y) { x + y };
};
>> let addTwo = newAdd(2);
>> addTwo(2);
4
```

Close the REPL:

```js
eof
```

## Tests

The following command will run all jest test suites:

```js
npm run test
```
