const CappuccinoFramework = require('./CappuccinoTestFramework.js');
const Lexer = require('../lexer.js');

const test = "long long int foo = 1+2+4*0;";
const result = Lexer.lexerCode(test);

const target = ["long long","int","foo","=","1","+","2","+","4","*","0",";"];
CappuccinoFramework.assert(result, target, 2);
