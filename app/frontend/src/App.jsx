import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SightingsProvider } from './context/SightingsContext';
import { TimeProvider } from './context/TimeContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TimeProvider>
          <SightingsProvider>
            <AppRoutes />
          </SightingsProvider>
        </TimeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
