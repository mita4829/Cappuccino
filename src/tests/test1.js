const CappuccinoFramework = require('./CappuccinoTestFramework.js');
const Lexer = require('../lexer.js');

const test = "int a = 42;";
const result = Lexer.lexerCode(test);

const target = ["int","a","=","42",";"];
CappuccinoFramework.assert(result, target, 1);
