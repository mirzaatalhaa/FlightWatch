import React from 'react';
import { useTime } from '../context/TimeContext';

const LockScreenTime = ({ align = 'center' }) => {
  const { currentTime, currentDate } = useTime();

  return (
    <div className={`lock-screen-time-container align-${align}`}>
      <div className="lock-screen-time-clock">
        {currentTime}
      </div>
      <div className="lock-screen-time-date">
        {currentDate}
      </div>
    </div>
  );
};

export default LockScreenTime;
