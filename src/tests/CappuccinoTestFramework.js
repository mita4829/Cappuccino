/*
Cappuccino Testing Framework contains useful functions for testing
*/
const NORMAL = "\x1B[0m";
const RED = "\x1B[31m";
const MAGENTA = "\x1B[35m";
const YELLOW = "\x1B[33m";
const GREEN = "\x1B[32m";
const CYAN = "\x1B[36m";

var print = function(message){
  console.log(message);
}

var isEqual = function(obj1, obj2){
  if(!obj1 instanceof Array || !obj2 instanceof Array){
    return false;
  }
  if(obj1.length != obj2.length){
    return false;
  }
  for(var i = 0; i<obj1.length; i++){
    if(obj1[i].token != obj2[i]){
      return false;
    }
  }
  return true;
}

var assert = function(obj1, obj2, num){
  if(isEqual(obj1, obj2)){
    print(GREEN+"Test "+num+": Passed"+NORMAL);
  }else{
    print(RED+"Test "+num+": Failed"+NORMAL);
  }
}

module.exports = {
  isEqual: isEqual,
  assert: assert,
};
