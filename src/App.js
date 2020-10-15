import React, { useState, useCallback, useRef } from 'react';
import './App.css';
import CalcTemplate from './components/CalcTemplate';
import Button from './components/Button';
import HistoryList from './components/HistoryList';

const App = () => {
  
  //기본 계산기
  const basicCalc = [
    [
      {id: '0',  text:'AC',  keytype:'top'},
      {id: '1',  text:'+/-', keytype:'top'},
      {id: '2',  text:'%',   keytype:'top'},
    ],
    [
      {id: '3', text:'9',  keytype:'number'},
      {id: '4', text:'8',  keytype:'number'},
      {id: '5', text:'7',   keytype:'number'},
      {id: '6', text:'6',   keytype:'number'},
      {id: '7', text:'5',   keytype:'number'},
      {id: '8', text:'4',   keytype:'number'},
      {id: '9', text:'3',   keytype:'number'},
      {id: '10', text:'2',   keytype:'number'},
      {id: '11', text:'1',   keytype:'number'},
      {id: '12', text:'.',  keytype:'dot'},
      {id: '13', text:'0',  keytype:'zero'},
    ],
    [
      {id: '14', text:'÷',   keytype:'sign'},
      {id: '15', text:'x',   keytype:'sign'},
      {id: '16', text:'-',   keytype:'sign'},
      {id: '17', text:'+',   keytype:'sign'},
      {id: '18', text:'=',   keytype:'equal'},
    ],
];

const engnCalc = [
  ...basicCalc, 
  [
    {id:'24', text:'mr', keytype:'top'},
    {id:'23', text:'m-', keytype:'top'},
    {id:'22', text:'m+', keytype:'top'},
    {id:'21', text:'mc', keytype:'top'},
    {id:'20', text:')', keytype:'top'},
    {id:'19', text:'(', keytype:'top'},

    {id:'30', text:'2', super:'x', keytype:'top'},
    {id:'29', text:'y', super:'x', keytype:'top'},
    {id:'28', text:'x', super:'y', keytype:'top'},
    {id:'27', text:'x', super:'3', keytype:'top'},
    {id:'26', text:'x', super:'2', keytype:'top'},
    {id:'25', text:'2', super:'nd', keytype:'top'}, //클릭시 버튼 변경됨

    {id:'36', text:'log', sub:'2', keytype:'top'},
    {id:'35', text:'log', sub:'y', keytype:'top'},
    {id:'34', text:'√', preSuper: 'y',sub:'x', keytype:'top'},
    {id:'33', text:'√', preSuper: '3', sub:'x', keytype:'top'},
    {id:'32', text:'√', preSuper: '2', sub:'x', keytype:'top'},
    {id:'31', text:'⁄', preSuper: '1', sub:'x', keytype:'top'},

    {id:'43', text:'EE', keytype:'top'},
    {id:'42', text:'e', keytype:'top'},
    {id:'41', text:'tan', super:'-1', keytype:'top'},
    {id:'39', text:'cos', super:'-1', keytype:'top'},
    {id:'38', text:'sin', super:'-1', keytype:'top'},
    {id:'37', text:'x!', keytype:'top'},

    {id:'49', text:'Rand', keytype:'top'},
    {id:'48', text:'π', keytype:'top'},
    {id:'47', text:'tanh', super:'-1', keytype:'top'},
    {id:'46', text:'cosh', super:'-1', keytype:'top'},
    {id:'45', text:'sinh', super:'-1', keytype:'top'},
    {id:'44', text:'Rad', keytype:'top'},
  ],
];

  const keypadType = [basicCalc, engnCalc];
  const [typeKeypads, setTypeKeypads] = useState(keypadType[0]);
  const type = useRef('basic');
  
  const [btnState, setBtnState] = useState([
    {key:0, value:'basic', name:'기본', state:true},
    {key:1, value:'engineering', name:'공학용', state:false},
    // {key:2, value:'programmer', name:'프로그래머', state:false}
  ])

  const onClick = useCallback((key) => {
    setBtnState(
      btnState.map(btn=>
        btn.key === key? {...btn, state:true} : {...btn, state:false}
      )
    )
    setTypeKeypads(keypadType[key]);
    type.current = btnState[key].value;
    wrappainter();
    
  },[btnState, keypadType]);

  const wrappainter=()=>{
    const typeChk = type.current;
    let CalcWrap = document.querySelector('.CalcWrap');
    if(typeChk==='basic'){
      CalcWrap.style.setProperty('width','288px');
      document.querySelector('.zero').style.setProperty('border-radius','0 0 0 9px');
    }else if(typeChk==='engineering'){
      CalcWrap.style.setProperty('width','726px');
      document.querySelector('.zero').style.setProperty('border-radius','0');
    }
  }

  const [history,setHistory] = useState([]);
  const historyId = useRef(0);

  const wrhist = useCallback(
    mathEx => {
      const list = {
        id: historyId.current,
        mathEx
      };
      setHistory(history.concat(list));
      historyId.current += 1;
    }, [history]
  );

  return(
    <>
    <Button btnState={btnState} onClick={onClick}/>
    <CalcTemplate typeKeypads={typeKeypads} typeChk={type.current} wrhist={wrhist}/>
    <HistoryList mathHistory={history}/>
    </>
  )
}

export default App;
