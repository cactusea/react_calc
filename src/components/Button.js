import React from 'react';

const Button = ({btnState, onClick}) => {

  return (
  <div className="ButtonWrapper">
    {btnState.map(btn=>(
      <button key={btn.key} className={btn.state?'SelectedBtn':'btn'} value={btn.value} onClick={()=>onClick(btn.key)}>
        {btn.name}
      </button>
    ))}
  </div>
  )

}

export default Button;