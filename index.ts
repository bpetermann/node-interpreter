import { Lexer } from './lexer';

const lexer = new Lexer(`
let five = 5;
let ten = 10;

let add = fn(x, y) {
  x + y;
};

let result = add(five, ten);
`);
console.log(lexer.start());
