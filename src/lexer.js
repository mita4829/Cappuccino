/*
Lexer.js 12/17/17 Michael Tang
*/
const NORMAL = "\x1B[0m";
const RED = "\x1B[31m";
const MAGENTA = "\x1B[35m";
const YELLOW = "\x1B[33m";
const GREEN = "\x1B[32m";
const CYAN = "\x1B[36m";

const UNDECLARED_IDENTIFIER = 0x0;
const EXPECTED_EXPRESSION = 0x1;

var print = function(message){
  console.log(message);
}

var Token = function(type, regExpr){
  this.type = type;
  this.regExpr = regExpr;
}

var Error = function(type, message, line, index, callback){
  this.type = type;
  this.message = message;
  this.line = line;
  this.index = index;
  this.callback = callback;
}

const Symbol = [
  //Numbers
  new Token('Integers', new RegExp(/^[0-9]+/)),
  new Token('Const', new RegExp(/^[0-9]+\.[0-9]+/)),
  //String
  new Token('String', new RegExp(/^".*"/)),
  new Token('PreProcessor', new RegExp(/^#(include|pragma|define)\b/)),
  new Token('Library', new RegExp(/^<.*>/)),
  //Modifier
  new Token('Modifier', new RegExp(/^(signed|unsigned|short|long long|long)\b/)),
  //Variable types
  new Token('Type', new RegExp(/^(char|int|float|double|void)\b/)),
  //Operators
  new Token('Operator', /^(=|==|!=|!|<|<=|>=|>|\+|-|\*|\/|%|&|\^|\(|\)|{|}|;|\[|\]|\|)/),
  //White space

  //Variable
  new Token('Name', new RegExp(/^[a-zA-Z_][a-zA-Z0-9_]*/)),
  new Token('Throw', new RegExp(/^(\t+|\s+)/)),
];

var consume = function(line){
  const symbolTableLegnth = Symbol.length;
  const lineLength = line.length;
  //Match potential symbols and return the corresponding token
  var tokens = [];
  var index = 0;
  //
  while(index < lineLength){
    var successfulToken = false;
    var result;
    for(var i = 0; i<symbolTableLegnth; i++){
      result = (line.substring(index)).match(Symbol[i].regExpr);
      if(result !== null){
        successfulToken = true;
        index += result[0].length - 1;
        if(Symbol[i].type !== 'Throw'){
          tokens.push(result[0]);
        }
        break;
      }
    }
    if(!successfulToken){
      return new Error(EXPECTED_EXPRESSION, "expected expression", line, index, ()=>{
        print(line);
        print(GREEN+"^".padStart(index+1)+NORMAL);
      });
    }
    index += 1;
  }
  return tokens;
}


var lexer = function(code){
  //Split lines on newline
  var lines = code.split('\n');
  const lineCount = lines.length;
  //Token stack
  var stack = [];
  //Loop through all the lines
  for(var i = 0; i<lineCount; i++){
    var line = lines[i];
    var index = 0;
    var tokenSet = consume(line);
    if(tokenSet instanceof Error){
      tokenSet.lineNumber = i;
      return tokenSet;
    }
    stack = stack.concat(tokenSet);
  }
  return stack;
}

var isValidFile = function(file){
  //Guard for non-existant file
  var fs = require('fs');
  fs.readFile(file, 'utf8', function(err, code) {
      if(err){
        print(RED+"error:"+NORMAL+" no such file or directory: '"+file+"'");
        print(RED+"error:"+NORMAL+" no input file");
        return;
      }
      var result = lexer(code);
      if(result instanceof Error){
        print(file+":"+result.lineNumber+":"+result.index+": "+RED+"error: "+NORMAL+result.message);
        result.callback !== null ? result.callback() : null;
        return;
      }
  });
}

var acceptFile = function(){
  const argv = process.argv[2];
  //Guard for no argv[2]
  if(argv === undefined){
    print(RED+"error:"+NORMAL+" no input file");
  }
  var result = isValidFile(argv);
  print(result);
}
acceptFile();
