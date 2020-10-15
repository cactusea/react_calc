import React from 'react';

const HistoryList = ({mathHistory}) => {
  return(
    <div>
      <div className="mathHistory">
        {mathHistory.map(history=> (
            <div key={history.id}>
              <span>{history.mathEx}</span>
            </div>
        ))}
      </div>
    </div>
  )
}

export default HistoryList;