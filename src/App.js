import React, { useState, useCallback } from 'react';
import './App.css';
import CalcTemplate from './components/CalcTemplate';
import Button from './components/Button';

const App = () => {
  
  //기본 계산기
  const calcType = [
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


  const [typeKeypads, setTypeKeypads] = useState(calcType);

  // const btnState = useRef(false);
  const [btnState, setBtnState] = useState([
    {key:0, value:'basic', name:'기본', state:true},
    {key:1, value:'engineering', name:'공학용', state:false},
    {key:2, value:'programmer', name:'프로그래머', state:false}
  ])

  const onClick = useCallback((key) => {
    setBtnState(
      btnState.map(btn=>
        btn.key === key? {...btn, state:true} : {...btn, state:false}
      )
    )
  },[btnState]);

  return(
    <>
    <Button btnState={btnState} onClick={onClick}/>
    <CalcTemplate typeKeypads={typeKeypads}/>
    </>
  )
}

export default App;
