import React from 'react';

export const checkDecimal = (answer) => {
  
  //소수점 자리수를 최대 15자리로 계산
  //0이 남는 경우 버림
  let decimalAnswer = answer.toFixed(15);
  decimalAnswer = parseFloat(decimalAnswer);
  
  return decimalAnswer;
  
}

export default {checkDecimal};