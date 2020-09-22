import React, { useState } from 'react';
import './App.css';
import CalcTemplate from './components/CalcTemplate';

const App = () => {
  
  //기본 계산기
  const calcType = [
    [
      {id: '0',  text:'AC',  keytype:'top'},
      {id: '1',  text:'+/-', keytype:'top'},
      {id: '2',  text:'%',   keytype:'top'},
    ],
    [
      {id: '11', text:'9',  keytype:'number'},
      {id: '10', text:'8',  keytype:'number'},
      {id: '9', text:'7',   keytype:'number'},
      {id: '8', text:'6',   keytype:'number'},
      {id: '7', text:'5',   keytype:'number'},
      {id: '6', text:'4',   keytype:'number'},
      {id: '5', text:'3',   keytype:'number'},
      {id: '4', text:'2',   keytype:'number'},
      {id: '3', text:'1',   keytype:'number'},
      {id: '13', text:'.',  keytype:'dot'},
      {id: '12', text:'0',  keytype:'zero'},
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

  return(
    <>
    <div>
      <button key={1} value="basic" onClick={()=>alert('기본 계산기')}>기본</button>
      <button key={2} value="engineering" onClick={()=>alert('공학용 계산기')}>공학용</button>
      <button key={3} value="programmer" onClick={()=>alert('프로그래머 계산기')}>프로그래머</button>
    </div>
    <CalcTemplate typeKeypads={typeKeypads}/>
    </>
  )
}

export default App;
