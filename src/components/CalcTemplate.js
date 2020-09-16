import React, { useState, useRef } from 'react';
import './CalcStyle.scss';

const numberArray = [];
const signArray   = [];

const CalcTemplate = ({typeKeypads}) => {

  const [paintResult, setPaintResult] = useState('0'); //화면에 표시되는 결과값
  const [paintMathEx, setPaintMathEx] = useState(''); //화면에 표시되는 수식

  const mathEx = useRef(''); //입력중인 수식
  const resultNum = useRef(0); //현재 입력중인 숫자 값

  // useEffect(()=>{
  //   setMathEx(totalMathEx.current);
  // },[totalMathEx.current]);

  const operator = () => {
    console.log('operator');
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

    console.dir(tempNumArr);
    console.dir(resultsignarr);

    //덧셈, 뺄셈 계산
    const answer = tempNumArr.reduce((pre, cur, index) => {
      const sign = resultsignarr[index-1];
      if(pre===0){
        return pre+cur;
      }

      if(sign==="+"){
        return pre+tempNumArr[index];
      }else if(sign==="-"){
        return pre-tempNumArr[index];
      }
      
    },0);

    setPaintResult(answer);
    setPaintMathEx(mathEx.current+=answer);

   }
   
  const keypadClick = (type, val) => {
    //클릭한 버튼의 type 조회
    if(type==='number' ){
      
      //숫자(number)인 경우 계속 이어나간다.
      resultNum.current = parseInt(resultNum.current+val+'');
      setPaintResult(resultNum.current);

      //숫자(혹은 .)가 눌린 경우 AC -> C 로 바뀐다.
      document.querySelector('.top').innerText = 'C';
      document.querySelector('.top').addEventListener('click',()=>{
        alert('clear button click');
      },false);

    }else if(type==='sign'){
      //기호(sign)인 경우 입력받은 기호를 확인한다.
      mathEx.current += resultNum.current+val;
      
      numberArray.push(resultNum.current);
      signArray.push(val);
      
      resultNum.current = 0;
      setPaintMathEx(mathEx.current);

    }else if(type==='equal'){
      numberArray.push(resultNum.current);
      mathEx.current += resultNum.current+val;
      setPaintMathEx(mathEx.current);

      //TODO: equal이 두 번 클릭된 경우에 대한 구현 필요
      //...

      //계산 실행
      operator();

    }else if(type==='top'){
      //위쪽 버튼(top)인 경우
      //TODO: AC, C 기능 구현
      //AC: All Clear. 모든 계산 초기화, 메모리 초기화
      //C: clear. 모든 계산을 초기화한다.

      //+/-
      //TODO: 음수, 양수 전환

      //%
      //TODO: 나누기 100
    }

    
    //TODO: keydown 이벤트 구현
    //숫자, 백스페이스

  }

  return(
    <>
    <span>입력중인 수식: {paintMathEx}</span>
    <div className="CalcWrap"> 
      <div className="CalcRsltBlock">
        {paintResult}
      </div>
      <div className="CalcNumBlcok">
        <div className="NumLine">
          {typeKeypads.map(keypad => (
          <div 
              className={'CalcNumKey '+keypad.keytype} 
              key={keypad.id} 
              onClick={()=>keypadClick(keypad.keytype, keypad.text)} 
          >
            {keypad.text}
          </div>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}

export default CalcTemplate;