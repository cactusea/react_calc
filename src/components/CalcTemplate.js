import React, { useEffect, useRef, useReducer, useCallback } from 'react';
import './CalcStyle.scss';
import * as Utils from './common/Utils';

// const numberArray = [];
// const signArray   = [];
const mathArray   = [];

const CalcTemplate = ({typeKeypads, typeChk, wrhist}) => {

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

  const paintMathEx = (val) => {
    dispatch({ type: 'PAINT_MATHEX', value: val });
  }
  const paintResult = (val) => {
    dispatch({ type: 'PAINT_RESULT', value: val });
  }
  const paintAnswer = (val) => {
    dispatch({ type: 'PAINT_ANSWER', value: val });
  }

  const [state, dispatch] = useReducer(CalcReducer, {mathEx:'', resultNum:0, answer:''});

  const mathEx = useRef(''); //입력중인 수식
  const resultNum = useRef(0); //현재 입력중인 숫자 값
  const completed = useRef(false);

  const initValue = useCallback(() => {
    resultNum.current = 0;
    mathEx.current='';
    mathArray.length=0;
    completed.current=false;
    paintMathEx('');
    paintAnswer('');
  }, []);

  const paintValue = useCallback(val=> {
    completed.current = true;
    resultNum.current = '';
    paintResult(val);
    paintMathEx(mathEx.current);
    paintAnswer('='+val);
  },[])

  const mathListwrite = useCallback(val=> {
    const finalMatheX = mathEx.current + '=' + val;
    wrhist(finalMatheX);
    //
  }, [wrhist]);

  /** 수식을 계산한다. */
  const operator = useCallback(() => {
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

    //결과값이 정수인지 확인 후,
    //수식에 사용된 숫자들 소수점 자릿수 확인 -> answer에 toFixed 적용
    if(!Number.isInteger(answer) && answer !== undefined){
      answer = Utils.checkDecimal(answer);
    }
    paintValue(answer);
    mathListwrite(answer);
    
  }, [paintValue, mathListwrite]);

  /** top key 클릭 이벤트 */
  const topKeypadClick = useCallback((val) => {
    if(val==='AC'){
      const clearBtn = document.querySelector('.TopKey').querySelector('.top').innerText;
      if(clearBtn==='C'){
        //입력중인 숫자 초기화
        resultNum.current = 0;
        document.querySelector('.TopKey').querySelector('.top').innerText = 'AC';

      }else if(clearBtn==='AC'){
        //모든 계산식, 결과값 초기화
        initValue();
      }

    }else if(val==='+/-'){
      resultNum.current = resultNum.current * -1;

    }else if(val==='%'){
      resultNum.current = resultNum.current * 0.01;
    }

    paintMathEx(mathEx.current);
    paintResult(resultNum.current);

  }, [initValue]);

  /** 연산자(sign) key 클릭 이벤트 */
  const signKeypadClick = useCallback((type, val) => {
    if(type==='sign'){
      if(val==='*'){val = 'x'}
      else if(val==='/'){val = '÷'};

      if(!completed.current){
        mathArray.push(resultNum.current);
      }
      completed.current = false;
      mathEx.current += resultNum.current+val;
      mathArray.push(val);
      resultNum.current = 0;
      paintMathEx(mathEx.current);

    }else if(type==='equal'){
      if(completed.current){
        //직전 수식을 반복한다.
        const prevSign = mathArray[mathArray.length-2];
        const prevNum = mathArray[mathArray.length-1];
        mathEx.current += prevSign + prevNum;
        mathArray.push(prevSign);
        mathArray.push(prevNum);
      }
      else {
        mathArray.push(resultNum.current);
        mathEx.current += resultNum.current;
      }

      paintMathEx(mathEx.current);
      
      //계산 실행
      operator();
    }

  }, [operator]);

  /** 숫자 key 클릭 이벤트 */
  const numKeypadClick = useCallback((type, val) => {
    if(completed.current){
      initValue();
    }
    if(type==='number' || type==='zero' ){
      resultNum.current = parseFloat(resultNum.current+val+'');

      //숫자(혹은 .)가 눌린 경우 AC -> C 로 바뀐다.
      document.querySelector('.TopKey').querySelector('.top').innerText = 'C';

    }else if(type==='dot'){
      //resultNum에 .이 이미 포함되어 있는지 확인
      if(resultNum.current.toString().indexOf('.') < 0){
        resultNum.current += '.';
      }
    }
    paintResult(resultNum.current);
  }, [initValue]);

  const pressKeyChk = useCallback((val) => {
    let targetType;
    typeKeypads.forEach(keypad=>{
      keypad.forEach(key=>{
        if(key.text===val){
          targetType = key.keytype;
        }
      })
    });
    if(val==='Enter'){
      targetType='equal';
    }else if(val==='*'){
      targetType='sign';
    }
    return targetType;
  }, [typeKeypads]);


  const keyPressHandler = useCallback(e => {
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
  }, [numKeypadClick, pressKeyChk, signKeypadClick, topKeypadClick]);

  useEffect(()=>{
    window.addEventListener('keypress', keyPressHandler);
    return ()=> window.removeEventListener('keypress', keyPressHandler);
  },[keyPressHandler]);

  return(
    <>
    <span className="MathExWrap">입력중인 수식: {state.mathEx}{state.answer}</span>
    <div className="CalcWrap"> 
      <div className="CalcRsltBlock">
        {state.resultNum}
      </div>
      <div className="CalcNumBlcok">
        {typeChk==='engineering' &&
          <div className="EngnWrap">
            {typeKeypads[3].map(keypad=>(
              <div key={keypad.id} className={'CalcNumKey '+keypad.keytype} onClick={()=>alert('현재 공학용 계산기는 사용하실 수 없습니다.')}>
               {keypad.preSuper &&  //위 첨자
                  <span className='PreSuperScr'>{keypad.preSuper}</span>
                } 
              {keypad.text}
                {keypad.super &&  //위 첨자
                  <span className='SuperScr'>{keypad.super}</span>
                }
                {keypad.sub && //아래 첨자
                  <span className='SubScr'>{keypad.sub}</span>
                }
              </div>
            ))}
          </div>
        }

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