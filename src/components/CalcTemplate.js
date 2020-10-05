import React, { useEffect, useRef, useReducer } from 'react';
import './CalcStyle.scss';
import * as Utils from './common/Utils';

// const numberArray = [];
// const signArray   = [];
const mathArray   = [];

const CalcTemplate = ({typeKeypads}) => {

  useEffect(()=>{
    const keyPressHandler = e => {
      const keyType = pressKeyChk(e.key);
      if(keyType==='number' || keyType==='zero' || keyType==='dot'){
        numKeypadClick(keyType, e.key);
      }
      else if(keyType==='top'){
        topKeypadClick(keyType, e.key);
      }
      else if(keyType==='sign' || keyType==='equal'){
        signKeypadClick(keyType, e.key);
      }
    }

    document.addEventListener('keypress', keyPressHandler);
  });

  const CalcReducer = (state, action) => {
    switch(action.type){
      case 'PAINT_MATHEX':
        return { ...state, mathEx: action.value};
      case 'PAINT_RESULT':
        return {...state, resultNum: action.value};
      case 'PAINT_ANSWER':
        return {...state, answer: action.value};
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(CalcReducer, {mathEx:'', resultNum:0, answer:''});
  const paintMathEx = (val) => {
    dispatch({ type: 'PAINT_MATHEX', value: val });
  }
  const paintResult = (val) => {
    dispatch({ type: 'PAINT_RESULT', value: val });
  }
  const paintAnswer = (val) => {
    dispatch({ type: 'PAINT_ANSWER', value: val });
  }

  const mathEx = useRef(''); //입력중인 수식
  const resultNum = useRef(0); //현재 입력중인 숫자 값
  const completed = useRef(false);


  /** 수식을 계산한다. */
  const operator = () => {
    let answer = 0;

    // 후위 계산식으로 변환
    // 괄호없이 기본 사칙연산 순서대로 진행하는 것으로 한다.
    const postfixMathEx = Utils.postfixCalc(mathArray);

    //후위 계산식 연산
    let numStack = [];
    postfixMathEx.forEach((val)=> {
      if(typeof val === 'number'){
        numStack.push(val);
      }else{
        const next = numStack.pop();
        const prev = numStack.pop();
        numStack.push(Utils.operator(prev, next, val));
      }
    })
    
    answer = numStack[0];

     //TODO: isInteger는 ie11에서는 안됨, 지원 가능하도록 수정
    //결과값이 정수인지 확인 후,
    //수식에 사용된 숫자들 소수점 자릿수 확인 -> answer에 toFixed 적용
    if(!Number.isInteger(answer) && answer !== undefined){
      console.log(typeof answer);
      answer = Utils.checkDecimal(answer);
    }

    completed.current = true;
    resultNum.current = '';

    paintResult(answer);
    paintMathEx(mathEx.current);
    paintAnswer('='+answer);

  }
      
  /** top key 클릭 이벤트 */
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
        //TODO: 입력중인 수식에서 답 부분은 clear 되지 않음
      }

    }else if(val==='+/-'){
      resultNum.current = resultNum.current * -1;

    }else if(val==='%'){
      resultNum.current = resultNum.current * 0.01;
    }

    paintMathEx(mathEx.current);
    paintResult(resultNum.current);

  } 

  /** 연산자(sign) key 클릭 이벤트 */
  const signKeypadClick = (type, val) => {
    if(type==='sign'){
      if(!completed.current){ 
        //numberArray.push(resultNum.current); 
        mathArray.push(resultNum.current);
      }
      completed.current = false;
      mathEx.current += resultNum.current+val;
      
      // signArray.push(val);
      mathArray.push(val);
      
      resultNum.current = 0;
      paintMathEx(mathEx.current);

      //TODO: 연산자가 연속해서 눌리는 경우?

    }else if(type==='equal'){
      if(completed.current){
        alert('사용할 수 없습니다.');
        return;
        //직전 수식을 반복한다.
        // resultNum.current = numberArray[numberArray.length-1];
        // mathEx.current += signArray[signArray.length-1];
        // signArray.push(signArray[signArray.length-1]);
      }

      // numberArray.push(resultNum.current);
      mathArray.push(resultNum.current);

      mathEx.current += resultNum.current;
      paintMathEx(mathEx.current);
      
      //계산 실행
      operator();
    }

  }

  /** 숫자 key 클릭 이벤트 */
  const numKeypadClick = (type, val) => {
    if(type==='number' || type==='zero' ){
      resultNum.current = parseFloat(resultNum.current+val+'');

      //숫자(혹은 .)가 눌린 경우 AC -> C 로 바뀐다.
      document.querySelector('.top').innerText = 'C';

    }else if(type==='dot'){
      //resultNum에 .이 이미 포함되어 있는지 확인
      if(resultNum.current.toString().indexOf('.') < 0){
        resultNum.current += '.';
      }
    }

    paintResult(resultNum.current);
  }

  function pressKeyChk(val) {
    let targetType;
    typeKeypads.forEach(keypad=>{
      keypad.forEach(key=>{
        if(key.text===val){
          targetType = key.keytype;
        }
      })
    })
    return targetType;
  }

  return(
    <>
    <span className="MathExWrap">입력중인 수식: {state.mathEx}{state.answer}</span>
    <div className="CalcWrap"> 
      <div className="CalcRsltBlock">
        {state.resultNum}
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