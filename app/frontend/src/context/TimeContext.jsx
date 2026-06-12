import React, { createContext, useContext, useState, useEffect } from 'react';

const TimeContext = createContext(null);

export const TimeProvider = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('09:41 AM');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTimeAndDate = () => {
      const now = new Date();

      // Clock: 12-hour format with AM/PM
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setCurrentTime(`${hours}:${minutes} ${ampm}`);

      // Date: E.g., "Friday, June 12, 2026"
      const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
      setCurrentDate(now.toLocaleDateString(undefined, options));
    };

    updateTimeAndDate();
    const timer = setInterval(updateTimeAndDate, 30000);
    return () => clearInterval(timer);
  }, []);

  const value = {
    currentTime,
    currentDate
  };

  return (
    <TimeContext.Provider value={value}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = () => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  return context;
};
