import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane } from 'lucide-react';

const AuthLayout = () => {
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

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-split-container">
      {/* Left Column — Elegant Dark Marketing Panel */}
      <div className="auth-sidebar">
        <div className="auth-sidebar-header">
          <Plane size={22} style={{ color: '#2997ff', transform: 'rotate(-45deg)' }} />
          <span className="logo-text">FlightWatch</span>
        </div>

        <div className="auth-sidebar-promo">
          <div>
            <span style={{ 
              color: '#2997ff', 
              fontSize: '14px', 
              fontWeight: 600, 
              letterSpacing: '0.5px', 
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: '12px'
            }}>
              ✈ Spotting Ledger
            </span>
            <h2>The art of aircraft spotting. Curated.</h2>
          </div>
          
          <p>
            Log tail registrations, identify airline fleets, record airports, 
            and follow statistics of your aircraft spotting adventures in a clean 
            journal designed to let details stand out.
          </p>

          <div style={{ 
            marginTop: '12px',
            padding: '16px 20px', 
            borderRadius: '11px', 
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <p style={{ fontSize: '14px', color: '#a1a1a6', margin: 0 }}>
              "FlightWatch elevates flight logging into a beautiful catalog. Zero clutter, pure focus."
            </p>
          </div>
        </div>

        <div className="auth-sidebar-footer">
          <p>© 2026 FlightWatch. A premium aviation ledger.</p>
        </div>
      </div>

      {/* Right Column — Authentication Form Viewport */}
      <div className="auth-form-side">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
