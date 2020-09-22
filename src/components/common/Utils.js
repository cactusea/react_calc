import React from 'react';

export const checkDecimal = (answer) => {
  const decimalLength = answer.toString().length-2;
  let decimalAnswer;
  
  //소수점 자리수는 최대 15자리까지 계산하되,
  //마지막 자리가 0으로 끝나는 경우 1 이상의 수가 나오는 경우까지만 계산한다.
  if(decimalLength>15){
    decimalAnswer = answer.toFixed(15);
    
    for (let i = 0; i < 15; i++) {
      const as=decimalAnswer.substr(decimalAnswer.length-i, 1);
      if(as!=='0'){
        return answer.toFixed(i+1);
      }
    }
  }

  return decimalAnswer;
}

export default {checkDecimal};