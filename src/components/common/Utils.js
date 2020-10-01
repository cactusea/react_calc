
/** 소수점 자리수 체크 */
export const checkDecimal = (answer) => {
  //소수점 자리수를 최대 15자리로 계산한다.
  //0이 남는 경우 버린다.
  let decimalAnswer = answer.toFixed(15);
  decimalAnswer = parseFloat(decimalAnswer);
  return decimalAnswer;
}

/** 입력받은 수식을 후위계산식으로 변경 */
export const postfixCalc = (arr) => {
  //1. 피연산자를 출력한다.
  //2. sign stack이 비어있으면 push한다.
  //3-1. sign stack이 비어있지 않은 경우 연산자의 우선순위를 체크한다.
  //3-2. stack 연산자 우선순위가 더 높은경우(우선인 경우) 대상 연산자를 출력하고,
  //     stack 연산자 우선순위가 낮거나 같은경우 대상 stack에 push한다.
  //4. 수식이 끝난 경우 stack연산자를 LIFO로 출력한다.
  let signStack = [];
  let resultEx = [];

  arr.forEach((val, index) => {
    if(index%2===0){
      resultEx.push(val);
    }else{
      if(signStack.length>0){
        const prev = signStack[signStack.length-1];
        const next = val;
        //연산자간의 우선순위를 체크
        if(pretChk(prev, next)){
          resultEx.push(signStack.pop());
        } 
      }
      signStack.push(val);
    }
  });

  //LIFO로 출력하기 위해 순서를 뒤집는다.
  signStack.reverse();
  
  //수식 뒤에 덧붙여 출력한다.
  return resultEx.concat(signStack);
  
}

export const operator = (prev, next, val) => {
  if(val==='+'){
    return prev+next;
  }else if(val==='-'){
    return prev-next;
  }else if(val==='x'){
    return prev * next;
  }else if(val==='÷'){
    return prev / next;
  }
}

/** 입력받은 연산자의 우선순위를 체크한다.
 * prev가 next보다 우선순위가 높은 경우에는 stack을 pop하고 next를 stack에 push한다.
 * 1) 곱셈, 나눗셈 -> 우선순위가 높다.
 * 2) 덧셈, 뺼셈  -> 우선순위가 낮다.
 */
function pretChk (prev, next) {
  if(prev==="x" || prev ==="÷"){
    if(next==="+" || next==="-"){
      return true;
    }
    return false;
  }
}

export default {checkDecimal, postfixCalc, operator};