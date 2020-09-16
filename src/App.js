import React, { useState } from 'react';
import './App.css';
import CalcTemplate from './components/CalcTemplate';

const App = () => {
  
  const calcType = [
    [
      {id: '0',  text:'AC',  keytype:'top'},
      {id: '1',  text:'+/-', keytype:'top'},
      {id: '2',  text:'%',   keytype:'top'},
      {id: '3',  text:'÷',   keytype:'sign'},
      {id: '4',  text:'7',   keytype:'number'},
      {id: '5',  text:'8',   keytype:'number'},
      {id: '6',  text:'9',   keytype:'number'},
      {id: '7',  text:'x',   keytype:'sign'},
      {id: '8',  text:'4',   keytype:'number'},
      {id: '9',  text:'5',   keytype:'number'},
      {id: '10', text:'6',   keytype:'number'},
      {id: '11', text:'-',   keytype:'sign'},
      {id: '12', text:'1',   keytype:'number'},
      {id: '13', text:'2',   keytype:'number'},
      {id: '14', text:'3',   keytype:'number'},
      {id: '15', text:'+',   keytype:'sign'},
      {id: '16', text:'0',   keytype:'zero'},
      {id: '17', text:'.',   keytype:'number'},
      {id: '18', text:'=',   keytype:'equal'},
    ],
    [
      {id: '0',  text:'AC',  keytype:'top'},
      {id: '1',  text:'공학용',  keytype:'top'},
    ],
    [
      {id: '0',  text:'AC',  keytype:'top'},
      {id: '1',  text:'프로그래머용',  keytype:'top'},
    ],
];

  const [typeFlag, setTypeFlag] = useState(0);
  const [typeKeypads, setTypeKeypads] = useState(calcType[0]);
  
  const btnClick = (typeFlag) => {
    const type = typeFlag;
    setTypeFlag(type);
    setTypeKeypads(calcType[type]);
  }

  return(
    <>
    <div>
      <button key={1} value="basic" onClick={()=>btnClick(0)}>기본</button>
      <button key={2} value="engineering" onClick={()=>btnClick(1)}>공학용</button>
      <button key={3} value="programmer" onClick={()=>btnClick(2)}>프로그래머</button>
    </div>
    <CalcTemplate typeKeypads={typeKeypads}/>
    </>
  )
}

export default App;
