import React from 'react';
import './HistoryListStyle.scss';

const HistoryList = ({mathHistory}) => {
  return(
    <div>
      <div className="mathHistory">
        <ul>
          {mathHistory.map(history=> (
            <li key={history.id}>{history.mathEx}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default HistoryList;