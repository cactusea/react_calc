import React, { useState, useRef } from 'react';
import './CalcStyle.scss';
import * as Utils from './common/Utils';

const numberArray = [];
const signArray   = [];

const CalcTemplate = ({typeKeypads}) => {

  const [paintResult, setPaintResult] = useState('0'); //화면에 표시되는 결과값
  const [paintMathEx, setPaintMathEx] = useState(''); //화면에 표시되는 수식

  const mathEx = useRef(''); //입력중인 수식
  const resultNum = useRef(0); //현재 입력중인 숫자 값

  const operator = () => {

    let tempNumArr = numberArray.slice();
    let resultsignarr =  signArray.slice();
    //TODO: 배열 여러개 두지 말고 객체 방식으로 구현해보면 어떨까

    signArray.forEach((element, index) => {
      //곱셉, 나눗셈을 먼저 계산
      if (element==="x") {
        const rr = numberArray[index] * numberArray[index+1];
        //새 배열에 순서대로 만드는 방식으로 대체 (filter?)
        tempNumArr[index] = rr;
        tempNumArr[index+1] = null;
        resultsignarr[index] = null;
      }
      else if(element==="÷"){
        const rr = numberArray[index] / numberArray[index+1];
        tempNumArr[index] = rr;
        tempNumArr[index+1] = null;
        resultsignarr[index] = null;
      }
    });

    //null값이 된 부분 삭제
    tempNumArr = tempNumArr.filter(val=> val!==null );
    resultsignarr = resultsignarr.filter(val=> val!==null );

    //덧셈, 뺄셈 계산
    let answer = tempNumArr.reduce((pre, cur, index) => {
      const sign = resultsignarr[index-1];
      let result;
      if(pre===0){
        result = pre+cur;
      }
      if(sign==="+"){
        result = pre+tempNumArr[index];
      }else if(sign==="-"){
        result = pre-tempNumArr[index];
      }
      return result;
      
    }, 0);
    
    //TODO: isInteger는 ie11에서는 안됨, 지원 가능하도록 수정
    //결과값이 정수인지 확인 후,
    //수식에 사용된 숫자들 소수점 자릿수 확인 -> answer에 toFixed 적용
    if(!Number.isInteger(answer)){
      answer = Utils.checkDecimal(answer);
    }

    setPaintResult(answer);
    setPaintMathEx(mathEx.current+=answer);
  }

      
  //TODO: keydown 이벤트 구현
  //숫자, 백스페이스
   
  //top key 클릭 이벤트
  const topKeypadClick = (val) => {
    
    if(val==='AC'){
      const clearBtn = document.querySelector('.top').innerText;
      if(clearBtn==='C'){
        //입력중인 숫자 초기화
        resultNum.current = 0;
        document.querySelector('.top').innerText = 'AC';

      }else if(clearBtn==='AC'){
        //모든 계산식, 결과값 초기화
        resultNum.current = 0;
        mathEx.current = '';
      }

    }else if(val==='+/-'){
      resultNum.current = resultNum.current * -1;

    }else if(val==='%'){
      resultNum.current = resultNum.current * 0.01;
    }

    setPaintMathEx(mathEx.current);
    setPaintResult(resultNum.current);

  } 

  //연산자(sign) key 클릭 이벤트
  const signKeypadClick = (type, val) => {
    if(type==='sign'){
      mathEx.current += resultNum.current+val;
      numberArray.push(resultNum.current);
      signArray.push(val);
      
      resultNum.current = 0;
      setPaintMathEx(mathEx.current);

      //TODO: 연산자가 연속해서 눌리는 경우?

    }else if(type==='equal'){
      numberArray.push(resultNum.current);
      mathEx.current += resultNum.current+val;
      setPaintMathEx(mathEx.current);

      //TODO: equal이 두 번 클릭된 경우에 대한 구현 필요
      //...

      //계산 실행
      operator();
    }

  }

  //숫자 key 클릭 이벤트
  const numKeypadClick = (type, val) => {

    if(type==='number' || type==='zero' ){
      resultNum.current = parseFloat(resultNum.current+val+'');

      //숫자(혹은 .)가 눌린 경우 AC -> C 로 바뀐다.
      document.querySelector('.top').innerText = 'C';

    }else if(type==='dot'){
      resultNum.current += '.';
    }
    setPaintResult(resultNum.current);

  }

  return(
    <>
    <span className="MathExWrap">입력중인 수식: {paintMathEx}</span>
    <div className="CalcWrap"> 
      <div className="CalcRsltBlock">
        {paintResult}
      </div>
      <div className="CalcNumBlcok">
        <div className="LeftCal">
          {/* TopKey START */}
          <div className="TopKey">
            {typeKeypads[0].map(keypad => (
              <div 
                key={keypad.id} 
                className={'CalcNumKey '+keypad.keytype} 
                onClick={()=>topKeypadClick(keypad.text)} >
                  {keypad.text} 
              </div>
            ))}
          </div>
          {/* TopKey END */}

          {/* NumKey START */}
          <div className="NumKey">
            {typeKeypads[1].map(keypad => (
              <div 
                key={keypad.id} 
                className={'CalcNumKey '+keypad.keytype} 
                onClick={()=>numKeypadClick(keypad.keytype, keypad.text)} >
                  {keypad.text} 
              </div>
            ))}
          </div>
          {/* NumKey END */}
        </div>

        {/* SignKey Start */}
        <div className="SignKey">
            {typeKeypads[2].map(keypad => (
              <div 
                key={keypad.id} 
                className={'CalcNumKey '+keypad.keytype} 
                onClick={()=>signKeypadClick(keypad.keytype, keypad.text)} >
                  {keypad.text} 
              </div>
            ))}
          </div>
        </div>
        {/* SignKey END */}
        
    </div>
    </>
  )
}

export default CalcTemplate;