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

var Lexem = function(token, type, line, index, callback){
  this.token = token;
  this.type = type;
  this.line = line;
  this.index = index;
  this.callback = callback;
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
  new Token('Int', new RegExp(/^[0-9]+/)),
  new Token('Floating', new RegExp(/^[0-9]+\.[0-9]+/)),
  //String
  new Token('String', new RegExp(/^".*"/)),
  new Token('Preprocessor', new RegExp(/^#(include|pragma|define)\b/)),
  new Token('Library', new RegExp(/^<.*>/)),
  //Modifier
  new Token('Modifier', new RegExp(/^(const|signed|unsigned|short|long long|long)\b/)),
  //Variable types
  new Token('Type', new RegExp(/^(char|int|float|double|void)\b/)),
  //Operators
  new Token('Operator', new RegExp(/^(=|==|!=|!|<|<=|>=|>|\+|-|\*|\/|%|&|\^|\(|\)|{|}|;|\[|\]|\|)/)),
  //Reserved words
  new Token('Keyword', new RegExp(/^(auto|break|case|continue|default|do|else|enum|extern|for|goto|if|inline|register|restrict|return|sizeof|static|struct|switch|typedef|union|void|volatile|while)/)),
  //Variable
  new Token('Name', new RegExp(/^[a-zA-Z_][a-zA-Z0-9_]*/)),
  //White space
  new Token('Throw', new RegExp(/^(\t+|\s+)/)),
];

var consume = function(line, number){
  const symbolTableLegnth = Symbol.length;
  const lineLength = line.length;
  //Match potential symbols and return the corresponding token
  var tokens = [];
  var index = 0;
  //Loop through the line
  while(index < lineLength){
    var successfulToken = false;
    var result;
    //See if any regexr matches.
    for(var i = 0; i<symbolTableLegnth; i++){
      result = (line.substring(index)).match(Symbol[i].regExpr);
      //Successful match
      if(result !== null){
        successfulToken = true;
        //If not whitespace token
        if(Symbol[i].type !== 'Throw'){
          //Push the character, the type, line, index, and potential callback
          tokens.push(new Lexem(result[0], Symbol[i].type, number, index, null));
        }
        //Move index to next location after token in line
        index += result[0].length - 1;
        break;
      }
    }
    //If no regexpr were Successful, throw an error
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


var lex = function(code){
  //Split lines on newline
  var lines = code.split('\n');
  const lineCount = lines.length;
  //Token stack
  var stack = [];
  //Loop through all the lines
  for(var i = 0; i<lineCount; i++){
    var line = lines[i];
    var index = 0;
    var tokenSet = consume(line,i);
    if(tokenSet instanceof Error){
      tokenSet.lineNumber = i+1;
      return tokenSet;
    }
    stack = stack.concat(tokenSet);
  }
  return stack;
}

var lexerCode = function(code){
  //Being lexing the file
  result = lex(code);
  //Catch Error instance if something failed to be lex in the file and call its callback
  if(result instanceof Error){
    print(file+":"+result.lineNumber+":"+result.index+": "+RED+"error: "+NORMAL+result.message);
    result.callback !== null ? result.callback() : null;
    return null;
  }

  return result;
}

var lexerFile = function(file){
  //Guard for non-existant file
  var result = null;
  var fs = require('fs');
  //Try to open the file
  try{
    var data = fs.readFileSync(file);
  }catch(err){
    print(RED+"error:"+NORMAL+" no such file or directory: '"+file+"'");
    print(RED+"error:"+NORMAL+" no input file");
    return null;
  }
  //Being lexing the file
  result = lexerCode(data.toString());
  return result;
}

var lexerArg = function(){
  //Guard for no argv[2]
  const argv = process.argv[2];
  //Guard for no argv[2]
  if(argv === undefined){
    print(RED+"error:"+NORMAL+" no input file");
    return null;
  }
  return lexerFile(argv);
}

module.exports = {
  lexerCode:lexerCode,
  lexerFile:lexerFile,
  lexerArg: lexerArg
};
