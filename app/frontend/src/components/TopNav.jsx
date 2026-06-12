import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Plane } from 'lucide-react';

const TopNav = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/sightings':
        return 'Sightings Log';
      case '/profile':
        return 'User Profile';
      default:
        return 'FlightWatch';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return user.name[0].toUpperCase();
  };

  return (
    <header className="sub-nav-frosted">
      <div className="sub-nav-title">
        <span>{getPageTitle()}</span>
      </div>

      <div className="sub-nav-actions">
        {location.pathname !== '/sightings' && (
          <span className="badge badge-primary" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Plane size={11} style={{ transform: 'rotate(-45deg)' }} /> Spotting active
          </span>
        )}
        
        {user && (
          <div className="user-profile-widget" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 102, 204, 0.08)',
                color: '#0066cc',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(0, 102, 204, 0.15)'
              }}>
                {getUserInitials()}
              </div>
              <span style={{ 
                fontFamily: 'var(--font-ui)', 
                fontSize: '14px', 
                fontWeight: 500, 
                color: 'var(--color-ink)' 
              }}>
                {user.name}
              </span>
            </div>
            
            <button
              className="btn btn-pearl btn-sm"
              onClick={handleLogout}
              title="Logout from FlightWatch"
              aria-label="Logout"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px' }}
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNav;
