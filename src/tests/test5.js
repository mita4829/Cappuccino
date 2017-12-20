const CappuccinoFramework = require('./CappuccinoTestFramework.js');
const Lexer = require('../lexer.js');

var fs = require('fs');

var data = fs.readFileSync("C_Files/test5.c");
const result = Lexer.lexerCode(data.toString(), "test5.c");
const target = ["#include","<stdio.h>","int","main","(",")","{", "int","foo","[","3","]","=","{","1",",","2",",","3","}",";","}"];
CappuccinoFramework.assert(result, target, 5);
