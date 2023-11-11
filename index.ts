import { Lexer } from './lexer';
import fs from 'fs';

const checkFileExists = (path: string) => {
  try {
    fs.accessSync(path);
    return true;
  } catch {
    return false;
  }
};

const file = './index.monkey';
if (checkFileExists(file)) {
  const data = fs.readFileSync(file, 'utf8');
  const lexer = new Lexer(data);
  console.log(lexer.start());
} else {
  console.error('File does not exist');
}
