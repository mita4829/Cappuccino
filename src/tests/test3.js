const CappuccinoFramework = require('./CappuccinoTestFramework.js');
const Lexer = require('../lexer.js');

const test = `
#include <stdio.h>
int main(){
  printf("Hello, World!");
}
`;
const result = Lexer.lexerCode(test);
const target = ["#include","<stdio.h>","int","main","(",")","{","printf","(","\"Hello, World!\"",")",";","}"];
CappuccinoFramework.assert(result, target, 3);
