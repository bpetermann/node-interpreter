import { Lexer } from './lexer';

const lexer = Lexer.getInstance();
console.log(lexer.new('=+(){},;'));
