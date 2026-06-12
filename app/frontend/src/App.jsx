import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SightingsProvider } from './context/SightingsContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SightingsProvider>
          <AppRoutes />
        </SightingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
