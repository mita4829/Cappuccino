const CappuccinoFramework = require('./CappuccinoTestFramework.js');
const Lexer = require('../lexer.js');

const test = `
#include <stdio.h>
int main(){
  while(1){
    int i = 0;
  }
}
`;
const result = Lexer.lexerCode(test);
const target = ["#include","<stdio.h>","int","main","(",")","{", "while", "(","1",")","{","int","i","=","0",";","}" ,"}"];
CappuccinoFramework.assert(result, target, 4);
