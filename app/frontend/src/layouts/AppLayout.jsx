import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { Plane } from 'lucide-react';

const AppLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        height: '100vh', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#f5f5f7', 
        fontFamily: 'system-ui, -apple-system, sans-serif', 
        color: '#1d1d1f' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <Plane className="animate-pulse" size={36} style={{ color: '#0066cc', marginBottom: '12px' }} />
          <p style={{ fontSize: '17px', fontWeight: 500 }}>Loading FlightWatch...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      {/* Apple-style thin black global header */}
      <header className="global-nav">
        <div className="global-nav-links">
          <span className="global-nav-link" style={{ fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plane size={14} style={{ color: '#2997ff', transform: 'rotate(-45deg)' }} />
            FlightWatch
          </span>
        </div>
        <div style={{ color: '#888888', fontSize: '12px', letterSpacing: '-0.1px', fontWeight: 400 }}>
          Spotter Center
        </div>
      </header>

      <div className="app-body-wrapper">
        <Sidebar />
        <div className="main-content">
          <TopNav />
          <main className="content-body">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
