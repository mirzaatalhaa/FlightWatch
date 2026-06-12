import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Plane, User } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Plane size={20} style={{ color: '#0066cc', transform: 'rotate(-45deg)' }} />
        <span className="logo-text">FlightWatch</span>
      </div>

      <nav style={{ flex: 1 }}>
        <ul className="sidebar-menu">
          <li className="menu-item">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => isActive ? 'active' : ''}
              end
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink
              to="/sightings"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <Plane size={18} />
              <span>Sightings</span>
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink
              to="/profile"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <User size={18} />
              <span>Profile</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <p style={{ margin: 0, fontSize: '11px', color: '#86868b' }}>✈ Aviation Ledger Console</p>
        <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#86868b' }}>v1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
